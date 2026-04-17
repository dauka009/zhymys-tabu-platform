import { Vacancy } from "@/types";

/**
 * Mock API integration to fetch external vacancies and format them.
 * Represents fetching from JSONPlaceholder / Remotive proxy.
 */
export async function fetchExternalVacancies(): Promise<Vacancy[]> {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=10");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const rawData = await response.json();

    // Map the external data to our domain model
    const itTitles = [
      "Junior React Developer", "Python Data Engineer", "DevOps Engineer",
      "Mobile App Developer (Flutter)", "QA Automation Engineer",
      "Machine Learning Engineer", "Full Stack Developer", "Cloud Architect",
      "Cybersecurity Analyst", "Blockchain Developer"
    ];
    const companies = ["Spotify", "Airbnb", "Shopify", "Stripe", "Notion", "Vercel", "GitHub", "Figma", "Coinbase", "Netflix"];
    const emojis = ["🌍", "🎵", "🏠", "🛍️", "💳", "📓", "▲", "🐙", "🎨", "🛡️"];

    return rawData.map((item: any, i: number) => ({
      id: `api_${item.id}`,
      title: itTitles[i] || `Remote Job #${item.id}`,
      companyId: `ext_comp_${i}`,
      company: {
        id: `ext_comp_${i}`,
        name: companies[i] || "Global Company",
        description: "International tech company.",
        industry: "IT",
        location: "Global",
        contacts: {}
      },
      salary: { min: 1500000 + (i * 100000), currency: "KZT" },
      location: "Қашықтан / Remote",
      type: "remote",
      category: "it",
      description: `${companies[i] || "Халықаралық компания"} үшін ${itTitles[i] || "маман"} вакансиясы. Толық қашықтан жұмыс. Ағылшын тілі B2.`,
      requirements: ["English B2", "Remote work experience", "3+ years of experience"],
      createdAt: new Date().toISOString(),
      emoji: emojis[i % emojis.length] || "🌍",
    }));

  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}
