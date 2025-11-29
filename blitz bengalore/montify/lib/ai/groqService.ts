/**
 * Groq AI Analysis Service (Client-side)
 * Calls server-side API route to keep API key secure
 */

export interface DatasetAnalysis {
  // Overall quality score (0-100)
  qualityScore: number;
  
  // Individual metrics (0-100)
  diversity: number;
  accuracy: number;
  completeness: number;
  consistency: number;
  
  // Bias level
  bias: 'low' | 'medium' | 'high';
  
  // Detailed insights
  insights: string[];
  
  // Recommendations for improvement
  recommendations: string[];
  
  // Data statistics
  statistics: {
    totalRecords: number;
    totalFields: number;
    missingDataPercentage: number;
    dataTypes: string[];
  };
}

/**
 * Analyze a JSON dataset using Groq AI (via API route)
 */
export async function analyzeDataset(jsonData: any): Promise<DatasetAnalysis> {
  try {
    console.log('🤖 Starting Groq AI analysis...');
    
    // Call our API route (keeps API key secure on server)
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jsonData }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Analysis failed');
    }

    const { analysis } = await response.json();
    console.log('✅ Analysis completed successfully');
    console.log('📊 Quality Score:', analysis.qualityScore);

    return analysis;

  } catch (error) {
    console.error('❌ Groq AI analysis failed:', error);
    throw error;
  }
}

/**
 * Check if a file is JSON and can be analyzed
 */
export function canAnalyzeFile(file: File): boolean {
  return file.type === 'application/json' || file.name.endsWith('.json');
}

/**
 * Read and parse JSON file for analysis
 */
export async function readJsonFile(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const json = JSON.parse(text);
        resolve(json);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Get available Groq models (all free)
 */
export const GROQ_MODELS = {
  MIXTRAL: 'mixtral-8x7b-32768',      // Fast, balanced, recommended
  LLAMA3_70B: 'llama3-70b-8192',      // Most powerful
  LLAMA3_8B: 'llama3-8b-8192',        // Fastest
  GEMMA_7B: 'gemma-7b-it',            // Google's model
} as const;
