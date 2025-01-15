export function formatPolicy(policyText?: string): Categories {
  const lines = policyText?.split("\r\n").filter((line) => line.trim() !== "");

  const categories: Categories = {
    general: [],
    repairs: {
      electricity: [],
      water: [],
    },
  };

  let currentSubcategory: "electricity" | "water" | null = null;

  lines?.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("- ")) {
      if (trimmed.includes("Sửa chữa điện")) {
        currentSubcategory = "electricity";
      } else if (trimmed.includes("Sửa chữa nước")) {
        currentSubcategory = "water";
      } else categories.general.push(trimmed.substring(2).trim());
    } else if (trimmed.startsWith("+ ")) {
      if (currentSubcategory) {
        categories.repairs[currentSubcategory].push(
          trimmed.substring(2).trim(),
        );
      }
    }
  });
  return categories;
}

type Categories = {
  general: string[];
  repairs: {
    electricity: string[];
    water: string[];
  };
};
