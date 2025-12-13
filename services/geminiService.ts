import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedArchitecture, SafetyReport, ResourceItem, GeneratedReport, Workspace } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to check for quota errors
const handleGeminiError = (error: any) => {
  console.error("Gemini API Error:", error);
  if (
    error.status === 429 || 
    error.code === 429 || 
    error.message?.includes('429') || 
    error.message?.includes('quota') ||
    error.message?.includes('RESOURCE_EXHAUSTED')
  ) {
    throw new Error("AI Usage Limit Exceeded. Please try again later or upgrade plan.");
  }
  return null;
};

export const generateArchitecturePlan = async (
  buildingType: string,
  landSize: string,
  floors: string,
  budget: string
): Promise<GeneratedArchitecture | null> => {
  try {
    const prompt = `Generate a detailed construction project lifecycle plan for a ${buildingType} on a ${landSize} plot with ${floors} floors. The budget is ₦${budget}.
    
    The plan MUST strictly follow these 5 specific phases as the 'stages':
    1. Project Acquisition & Bidding
    2. Project Planning & Design
    3. Procurement & Mobilization
    4. Construction & Project Execution
    5. Project Close-out

    For each phase, provide a concise description of activities and estimated duration.
    Also provide a total cost estimate in Naira, a total timeline, and a list of major materials needed.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            costEstimate: { type: Type.STRING, description: "Estimated total cost in Naira" },
            timeline: { type: Type.STRING, description: "Total project duration" },
            materials: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of key materials needed"
            },
            stages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  duration: { type: Type.STRING }
                }
              }
            },
            summary: { type: Type.STRING, description: "A professional summary of the project plan" }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedArchitecture;
    }
    return null;
  } catch (error) {
    return handleGeminiError(error);
  }
};

export const analyzeSafetyImage = async (base64Image: string): Promise<SafetyReport | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          },
          {
            text: "Analyze this construction site image for safety hazards. Identify PPE violations, structural risks, and housekeeping issues. Assign a safety risk score from 0 (Safe) to 100 (High Danger)."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.NUMBER },
            hazards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                  recommendation: { type: Type.STRING }
                }
              }
            },
            summary: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as SafetyReport;
    }
    return null;
  } catch (error) {
    return handleGeminiError(error);
  }
};

export const getResourceRecommendations = async (resources: any[]): Promise<string> => {
    try {
        const resourceStr = JSON.stringify(resources);
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Review this inventory list: ${resourceStr}. Provide a concise 2-sentence recommendation for stock planning based on typical construction usage rates.`
        });
        return response.text || "AI Insights unavailable.";
    } catch (error) {
        console.error("Gemini Insight Error:", error);
        // We don't throw here to avoid breaking the dashboard just for an insight string
        return "AI Insights currently unavailable due to usage limits.";
    }
}

export const generateResourceAllocation = async (
  projectType: string,
  stage: string,
  budget: string
): Promise<ResourceItem[] | null> => {
  try {
    const prompt = `Generate a realistic construction resource inventory list for a '${projectType}' project currently in the '${stage}' stage with a budget of ₦${budget}.
    
    Return a list of 5-8 key resources (materials, equipment, or labor) relevant to this specific stage.
    For example, if the stage is 'Foundation', include Cement, Sand, Granite, Diggers.
    If 'Finishing', include Paint, Tiles, Doors.
    
    Provide realistic quantities and thresholds.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              quantity: { type: Type.NUMBER },
              unit: { type: Type.STRING },
              threshold: { type: Type.NUMBER },
              status: { type: Type.STRING, enum: ["Good", "Low", "Critical"] }
            }
          }
        }
      }
    });

    if (response.text) {
      const items = JSON.parse(response.text) as any[];
      // Add IDs
      return items.map((item, index) => ({
        ...item,
        id: `ai-${Date.now()}-${index}`
      }));
    }
    return null;
  } catch (error) {
    return handleGeminiError(error);
  }
};

export const generateProjectReport = async (workspace: Workspace): Promise<GeneratedReport | null> => {
  try {
    const criticalResources = workspace.resources.filter(r => r.status === 'Critical').map(r => r.name).join(', ');
    const lowResources = workspace.resources.filter(r => r.status === 'Low').map(r => r.name).join(', ');
    
    const prompt = `Generate a professional Daily Construction Site Report for the project "${workspace.name}".
    
    Context:
    - Stage: ${workspace.stage}
    - Progress: ${workspace.progress}%
    - Safety Score: ${workspace.safetyScore}/100
    - Critical Resources (Out of stock): ${criticalResources || 'None'}
    - Low Resources: ${lowResources || 'None'}
    
    Write an "Executive Summary", a "Progress Update" (inferring reasonable activities for the ${workspace.stage} stage), "Key Issues" (based on resources/safety), and "Recommendations".`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            progressUpdate: { type: Type.STRING },
            keyIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedReport;
    }
    return null;
  } catch (error) {
    return handleGeminiError(error);
  }
};