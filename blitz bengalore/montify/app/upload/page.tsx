"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { useToast } from "@/lib/context/ToastContext";
import {
  analyzeDataset,
  canAnalyzeFile,
  readJsonFile,
  type DatasetAnalysis,
} from "@/lib/ai/groqService";
import { useMonadWallet } from "@/lib/wallet/MonadWalletProvider";
import {
  uploadToIPFS,
  uploadMetadataToIPFS,
  getIPFSUrl,
  type DatasetMetadata,
} from "@/lib/ipfs/pinataService";
import { registerDataset } from "@/lib/contract/datasetContract";
import { ethers } from "ethers";
import {
  Wallet,
  FileText,
  DollarSign,
  Tag,
  FolderOpen,
  ExternalLink,
} from "lucide-react";

export default function UploadPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [metadataHash, setMetadataHash] = useState<string | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<DatasetAnalysis | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [datasetId, setDatasetId] = useState<number | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Metadata form fields
  const [metadata, setMetadata] = useState({
    name: "",
    description: "",
    category: "machine-learning",
    price: "0.01",
    tags: "",
  });

  const { showToast } = useToast();
  const { isConnected, address, chainId, connect } = useMonadWallet();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Validate file size (max 10 GB = 10,737,418,240 bytes)
        const maxSize = 10 * 1024 * 1024 * 1024;
        if (file.size > maxSize) {
          showToast("File size exceeds 10 GB limit", "error");
          return;
        }

        setUploadedFile(file);
        setCurrentStep(1); // Stay on step 1 (Upload) when file is selected
        showToast(`File "${file.name}" selected successfully`, "success");
      }
    },
    [showToast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "text/csv": [".csv"],
      "application/json": [".json"],
      "application/x-parquet": [".parquet"],
      "application/zip": [".zip"],
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "audio/*": [".mp3", ".wav", ".flac"],
      "video/*": [".mp4", ".avi", ".mov"],
    },
  });

  const handleStartUpload = async () => {
    if (!uploadedFile) {
      showToast("Please select a file first", "warning");
      return;
    }

    if (!isConnected) {
      showToast("Please connect your wallet first", "warning");
      return;
    }

    if (chainId !== 10143) {
      showToast("Please switch to Monad Testnet", "warning");
      return;
    }

    // Validate metadata
    if (!metadata.name.trim()) {
      showToast("Please enter a dataset name", "warning");
      return;
    }

    if (!metadata.description.trim()) {
      showToast("Please enter a description", "warning");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadComplete(false);
    setIpfsHash(null);
    setMetadataHash(null);
    setDatasetId(null);
    setTxHash(null);
    setAiAnalysis(null);
    setCurrentStep(2); // Move to step 2 (Uploading)

    try {
      // STEP 1: AI Analysis (if applicable)
      let analysis: DatasetAnalysis | null = null;
      if (canAnalyzeFile(uploadedFile)) {
        setIsAnalyzing(true);
        showToast("Analyzing dataset with AI...", "info");
        setUploadProgress(10);

        try {
          const jsonData = await readJsonFile(uploadedFile);
          analysis = await analyzeDataset(jsonData);
          setAiAnalysis(analysis);
          showToast("AI analysis completed!", "success");
        } catch (analysisError: any) {
          console.error("AI analysis error:", analysisError);

          // Check if it's an API key error
          if (
            analysisError?.message?.includes("Invalid") ||
            analysisError?.message?.includes("API key") ||
            analysisError?.message?.includes("401")
          ) {
            console.log("⚠️  GROQ_API_KEY not configured or invalid");
            console.log("📝 See GROQ_SETUP.md for instructions");
            showToast(
              "AI analysis unavailable - configure GROQ_API_KEY (see console)",
              "warning"
            );
          } else {
            showToast(
              "AI analysis failed, continuing with upload...",
              "warning"
            );
          }
        } finally {
          setIsAnalyzing(false);
        }
      }

      // STEP 2: Upload file to IPFS
      setUploadProgress(20);
      setCurrentStep(3); // Move to step 3 (Encrypting/Uploading)
      showToast("Uploading file to IPFS...", "info");

      const ipfsUploadResult = await uploadToIPFS(uploadedFile);
      setIpfsHash(ipfsUploadResult.IpfsHash);
      setUploadProgress(50);
      showToast(
        `File uploaded to IPFS: ${ipfsUploadResult.IpfsHash}`,
        "success"
      );
      console.log("📦 IPFS Upload:", ipfsUploadResult);

      // STEP 3: Create and upload metadata to IPFS
      setUploadProgress(60);
      setCurrentStep(4); // Move to step 4 (Metadata)
      showToast("Uploading metadata to IPFS...", "info");

      const metadataObj: DatasetMetadata = {
        name: metadata.name,
        description: metadata.description,
        fileType: uploadedFile.type || "unknown",
        fileSize: uploadedFile.size,
        category: metadata.category,
        price: metadata.price,
        qualityScore: analysis?.qualityScore,
        uploadedBy: address || "",
        uploadedAt: new Date().toISOString(),
        tags: metadata.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      const metadataUploadResult = await uploadMetadataToIPFS(metadataObj);
      setMetadataHash(metadataUploadResult.IpfsHash);
      setUploadProgress(75);
      showToast(
        `Metadata uploaded to IPFS: ${metadataUploadResult.IpfsHash}`,
        "success"
      );
      console.log("📝 Metadata Upload:", metadataUploadResult);

      // STEP 4: Register on blockchain (optional - contract needs to be deployed)
      setUploadProgress(85);
      setCurrentStep(5); // Move to step 5 (Blockchain)
      showToast("Registering on Monad blockchain...", "info");

      try {
        // Get signer from wallet
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Note: This will fail until contract is deployed
        // For now, we'll catch and continue
        const result = await registerDataset(
          signer,
          ipfsUploadResult.IpfsHash,
          metadataUploadResult.IpfsHash,
          metadata.price,
          metadata.category
        );

        setDatasetId(result.datasetId);
        setTxHash(result.txHash);
        showToast("Dataset registered on blockchain!", "success");
        console.log("⛓️ Blockchain Registration:", result);
      } catch (blockchainError) {
        console.error("Blockchain registration error:", blockchainError);
        showToast(
          "Blockchain registration pending (contract deployment required)",
          "warning"
        );
      }

      // Complete!
      setUploadProgress(100);
      setUploadComplete(true);
      showToast("Upload process complete!", "success");
    } catch (error) {
      console.error("Upload error:", error);
      showToast(
        error instanceof Error ? error.message : "Upload failed",
        "error"
      );
      setUploadProgress(0);
      setCurrentStep(1);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setIpfsHash(null);
    setMetadataHash(null);
    setDatasetId(null);
    setTxHash(null);
    setUploadComplete(false);
    setAiAnalysis(null);
    setCurrentStep(1);
    showToast("File removed", "info");
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`, "success");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <>
      <main className="min-h-screen bg-background-base pt-24">
        <div className="container-center py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Icon */}
            <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center shadow-glow-purple">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
              </svg>
            </div>

            <h1 className="font-display text-5xl font-bold text-foreground-primary mb-4">
              Upload Your Dataset
            </h1>

            <p className="text-xl text-foreground-secondary mb-8">
              A 5-step wizard to encrypt, verify, and list your dataset on the
              marketplace
            </p>

            {/* Wallet Connection Warning */}
            {!isConnected && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 mb-8 max-w-2xl mx-auto"
              >
                <div className="flex items-start gap-4">
                  <Wallet className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-semibold text-orange-500 mb-2">
                      Wallet Connection Required
                    </h3>
                    <p className="text-sm text-foreground-secondary mb-4">
                      Please connect your wallet to upload datasets. Your wallet
                      address will be used to track ownership and receive
                      payments.
                    </p>
                    <button
                      onClick={connect}
                      className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                    >
                      Connect Wallet
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Wrong Network Warning */}
            {isConnected && chainId !== 10143 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8 max-w-2xl mx-auto"
              >
                <div className="flex items-start gap-4">
                  <svg
                    className="w-6 h-6 text-red-500 flex-shrink-0 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-semibold text-red-500 mb-2">
                      Wrong Network
                    </h3>
                    <p className="text-sm text-foreground-secondary">
                      Please switch to Monad Testnet (Chain ID: 10143) to upload
                      datasets.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Connected Wallet Info */}
            {isConnected && chainId === 10143 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-8 max-w-2xl mx-auto"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-sm text-foreground-secondary">
                    Connected:{" "}
                    <span className="font-mono text-green-500">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>{" "}
                    on Monad Testnet
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step Indicator */}
            <div className="bg-background-elevated/60 backdrop-blur-2xl border border-accent-pink/20 rounded-2xl p-8 mb-8">
              <div className="flex items-center justify-between max-w-2xl mx-auto">
                {[
                  { step: 1, label: "Upload" },
                  { step: 2, label: "Metadata" },
                  { step: 3, label: "Encrypting" },
                  { step: 4, label: "Verification" },
                  { step: 5, label: "Listing" },
                ].map((item, i) => (
                  <div key={item.step} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                          currentStep >= item.step
                            ? "bg-gradient-to-br from-accent-pink to-accent-magenta text-white shadow-glow-pink"
                            : "bg-background-surface text-foreground-tertiary border-2 border-border-DEFAULT"
                        }`}
                      >
                        {currentStep > item.step ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          item.step
                        )}
                      </div>
                      <span
                        className={`text-xs mt-2 transition-colors ${
                          currentStep >= item.step
                            ? "text-accent-pink font-semibold"
                            : "text-foreground-secondary"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    {i < 4 && (
                      <div
                        className={`w-16 h-0.5 mx-2 mb-6 transition-all duration-300 ${
                          currentStep > item.step
                            ? "bg-gradient-to-r from-accent-pink to-accent-magenta"
                            : "bg-border-DEFAULT"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Upload Box */}
            {!uploadedFile ? (
              <div
                {...getRootProps()}
                className={`bg-background-elevated/60 backdrop-blur-2xl border-2 border-dashed rounded-2xl p-16 mb-12 transition-all cursor-pointer ${
                  isDragActive
                    ? "border-accent-pink bg-accent-pink/10 scale-[1.02]"
                    : "border-accent-pink/30 hover:border-accent-pink/60"
                }`}
              >
                <input {...getInputProps()} />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto mb-4 text-accent-pink"
                >
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                  <path d="M12 12v9" />
                  <path d="m16 16-4-4-4 4" />
                </svg>
                {isDragActive ? (
                  <p className="text-xl text-accent-pink font-semibold mb-2">
                    Drop the file here...
                  </p>
                ) : (
                  <>
                    <p className="text-xl text-foreground-primary font-semibold mb-2">
                      Drag and drop your file here
                    </p>
                    <p className="text-sm text-foreground-tertiary">
                      or click to browse
                    </p>
                  </>
                )}
                <p className="text-xs text-foreground-tertiary mt-4">
                  Supported: CSV, JSON, Parquet, ZIP, Images, Audio, Video • Max
                  10 GB
                </p>
              </div>
            ) : (
              <div className="bg-background-elevated/60 backdrop-blur-2xl border border-accent-pink/20 rounded-2xl p-8 mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-accent-pink/10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-accent-pink"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-lg font-semibold text-foreground-primary">
                      {uploadedFile.name}
                    </p>
                    <p className="text-sm text-foreground-secondary">
                      {formatFileSize(uploadedFile.size)}
                    </p>
                  </div>
                  {!isUploading && !uploadComplete && (
                    <button
                      onClick={handleRemoveFile}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Metadata Form (only show before upload starts) */}
                {!isUploading && !uploadComplete && (
                  <div className="space-y-6 mb-8">
                    <h3 className="text-xl font-bold text-foreground-primary mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-400" />
                      Dataset Metadata
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-foreground-secondary mb-2">
                        Dataset Name *
                      </label>
                      <input
                        type="text"
                        value={metadata.name}
                        onChange={(e) =>
                          setMetadata({ ...metadata, name: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-background-surface border border-purple-500/30 rounded-lg text-foreground-primary focus:outline-none focus:border-purple-500/60 transition-colors"
                        placeholder="Enter dataset name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground-secondary mb-2">
                        Description *
                      </label>
                      <textarea
                        value={metadata.description}
                        onChange={(e) =>
                          setMetadata({
                            ...metadata,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-background-surface border border-purple-500/30 rounded-lg text-foreground-primary focus:outline-none focus:border-purple-500/60 transition-colors resize-none"
                        rows={4}
                        placeholder="Describe your dataset..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-foreground-secondary mb-2 flex items-center gap-2">
                          <FolderOpen className="w-4 h-4" />
                          Category
                        </label>
                        <select
                          value={metadata.category}
                          onChange={(e) =>
                            setMetadata({
                              ...metadata,
                              category: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-background-surface border border-purple-500/30 rounded-lg text-foreground-primary focus:outline-none focus:border-purple-500/60 transition-colors"
                        >
                          <option value="machine-learning">
                            Machine Learning
                          </option>
                          <option value="nlp">
                            Natural Language Processing
                          </option>
                          <option value="computer-vision">
                            Computer Vision
                          </option>
                          <option value="audio">Audio</option>
                          <option value="finance">Finance</option>
                          <option value="healthcare">Healthcare</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground-secondary mb-2 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Price (MONAD)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={metadata.price}
                          onChange={(e) =>
                            setMetadata({ ...metadata, price: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-background-surface border border-purple-500/30 rounded-lg text-foreground-primary focus:outline-none focus:border-purple-500/60 transition-colors"
                          placeholder="0.01"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground-secondary mb-2 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={metadata.tags}
                        onChange={(e) =>
                          setMetadata({ ...metadata, tags: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-background-surface border border-purple-500/30 rounded-lg text-foreground-primary focus:outline-none focus:border-purple-500/60 transition-colors"
                        placeholder="e.g., classification, images, medical"
                      />
                    </div>
                  </div>
                )}

                {isUploading && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-foreground-secondary mb-2">
                      <span>Uploading to storage...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-background-surface rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-accent-pink to-accent-magenta"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}

                {uploadComplete && ipfsHash && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-6"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <h3 className="text-lg font-bold text-green-500">
                        Upload Successful!
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {/* IPFS Hash */}
                      <div className="bg-background-base/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-foreground-secondary">
                            IPFS Hash (Data):
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(ipfsHash, "IPFS Hash")
                            }
                            className="text-xs px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full hover:bg-purple-500/20 transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                        <p className="text-sm text-foreground-primary font-mono break-all">
                          {ipfsHash}
                        </p>
                      </div>

                      {/* Metadata Hash */}
                      {metadataHash && (
                        <div className="bg-background-base/50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-foreground-secondary">
                              IPFS Hash (Metadata):
                            </span>
                            <button
                              onClick={() =>
                                copyToClipboard(metadataHash, "Metadata Hash")
                              }
                              className="text-xs px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full hover:bg-purple-500/20 transition-colors"
                            >
                              Copy
                            </button>
                          </div>
                          <p className="text-sm text-foreground-primary font-mono break-all">
                            {metadataHash}
                          </p>
                        </div>
                      )}

                      {/* Dataset ID */}
                      {datasetId !== null && (
                        <div className="bg-background-base/50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-foreground-secondary">
                              Dataset ID (On-chain):
                            </span>
                            <span className="text-xs px-3 py-1 bg-green-500/10 text-green-400 rounded-full">
                              Registered
                            </span>
                          </div>
                          <p className="text-sm text-foreground-primary font-mono">
                            #{datasetId}
                          </p>
                        </div>
                      )}

                      {/* Transaction Hash */}
                      {txHash && (
                        <div className="bg-background-base/50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-foreground-secondary">
                              Transaction Hash:
                            </span>
                            <a
                              href={`https://testnet.monadexplorer.com/tx/${txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full hover:bg-purple-500/20 transition-colors flex items-center gap-1"
                            >
                              View <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <p className="text-sm text-foreground-primary font-mono break-all">
                            {txHash}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 mt-6">
                      {ipfsHash && (
                        <a
                          href={getIPFSUrl(ipfsHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors text-center flex items-center justify-center gap-2"
                        >
                          View on IPFS <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={handleRemoveFile}
                        className="px-4 py-2 bg-background-surface text-foreground-primary rounded-lg text-sm font-semibold hover:bg-background-elevated transition-colors"
                      >
                        Upload Another
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* AI Analysis Results */}
                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-accent-pink/10 border border-accent-pink/30 rounded-xl p-6 mb-6"
                  >
                    <div className="flex items-center gap-3">
                      <div className="animate-spin">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-accent-pink"
                        >
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground-primary">
                          Analyzing with AI...
                        </h3>
                        <p className="text-sm text-foreground-secondary">
                          Groq AI is evaluating your dataset quality
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {aiAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-background-elevated/80 backdrop-blur-xl border border-accent-pink/20 rounded-xl p-6 mb-6"
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-accent-pink"
                      >
                        <path d="M12 3l-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                      </svg>
                      <h3 className="text-xl font-bold text-foreground-primary">
                        AI Quality Analysis
                      </h3>
                    </div>

                    {/* Overall Quality Score */}
                    <div className="bg-gradient-to-r from-accent-pink/10 to-accent-magenta/10 rounded-lg p-6 mb-6">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-accent-pink mb-2">
                          {aiAnalysis.qualityScore}
                        </div>
                        <div className="text-sm text-foreground-secondary">
                          Overall Quality Score
                        </div>
                      </div>
                    </div>

                    {/* Individual Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-background-surface/60 rounded-lg p-4">
                        <div className="text-2xl font-bold text-foreground-primary mb-1">
                          {aiAnalysis.diversity}%
                        </div>
                        <div className="text-xs text-foreground-secondary">
                          Diversity
                        </div>
                      </div>
                      <div className="bg-background-surface/60 rounded-lg p-4">
                        <div className="text-2xl font-bold text-foreground-primary mb-1">
                          {aiAnalysis.accuracy}%
                        </div>
                        <div className="text-xs text-foreground-secondary">
                          Accuracy
                        </div>
                      </div>
                      <div className="bg-background-surface/60 rounded-lg p-4">
                        <div className="text-2xl font-bold text-foreground-primary mb-1">
                          {aiAnalysis.completeness}%
                        </div>
                        <div className="text-xs text-foreground-secondary">
                          Completeness
                        </div>
                      </div>
                      <div className="bg-background-surface/60 rounded-lg p-4">
                        <div className="text-2xl font-bold text-foreground-primary mb-1">
                          {aiAnalysis.consistency}%
                        </div>
                        <div className="text-xs text-foreground-secondary">
                          Consistency
                        </div>
                      </div>
                      <div className="bg-background-surface/60 rounded-lg p-4">
                        <div
                          className={`text-2xl font-bold mb-1 ${
                            aiAnalysis.bias === "low"
                              ? "text-accent-green"
                              : aiAnalysis.bias === "medium"
                              ? "text-accent-orange"
                              : "text-red-500"
                          }`}
                        >
                          {aiAnalysis.bias.toUpperCase()}
                        </div>
                        <div className="text-xs text-foreground-secondary">
                          Bias Level
                        </div>
                      </div>
                      <div className="bg-background-surface/60 rounded-lg p-4">
                        <div className="text-2xl font-bold text-foreground-primary mb-1">
                          {aiAnalysis.statistics.totalRecords.toLocaleString()}
                        </div>
                        <div className="text-xs text-foreground-secondary">
                          Records
                        </div>
                      </div>
                    </div>

                    {/* Insights */}
                    {aiAnalysis.insights.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-bold text-foreground-primary mb-3">
                          Key Insights
                        </h4>
                        <div className="space-y-2">
                          {aiAnalysis.insights.map((insight, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 text-sm text-foreground-secondary"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-accent-pink mt-0.5 flex-shrink-0"
                              >
                                <polyline points="9 11 12 14 22 4" />
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                              </svg>
                              <span>{insight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {aiAnalysis.recommendations.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-bold text-foreground-primary mb-3">
                          Recommendations
                        </h4>
                        <div className="space-y-2">
                          {aiAnalysis.recommendations.map((rec, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 text-sm text-foreground-secondary"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-accent-orange mt-0.5 flex-shrink-0"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 16v-4" />
                                <path d="M12 8h.01" />
                              </svg>
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            <p className="text-sm text-foreground-tertiary mb-8">
              <strong>What happens next:</strong> Your dataset will be uploaded
              to decentralized storage. After upload, you'll receive a unique ID
              that can be used to access your file.
            </p>

            {!uploadComplete && (
              <button
                onClick={handleStartUpload}
                disabled={!uploadedFile || isUploading}
                className="px-8 py-4 bg-accent-pink text-white rounded-full font-semibold hover:bg-accent-magenta hover:shadow-glow-pink transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? "Uploading..." : "Start Upload Process"}
              </button>
            )}
          </motion.div>
        </div>
      </main>
    </>
  );
}
