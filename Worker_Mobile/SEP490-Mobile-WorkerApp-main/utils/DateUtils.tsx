export enum DateToStringModes {
  DMY,
  YMD,
}
export function DateToString(input: Date, mode: DateToStringModes): string {
  switch (mode) {
    case DateToStringModes.DMY: {
      return `${input.getDate().toString().padStart(2, "0")}-${(
        input.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${input.getFullYear()}`;
    }
    case DateToStringModes.YMD: {
      return `${input.getFullYear()}-${(input.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${input.getDate().toString().padStart(2, "0")}`;
    }
  }
}

export function ConvertToOtherDateStringFormat(
  dateString: string,
  mode: DateToStringModes
) {
  const date = new Date(dateString);

  // Get the day, month, and year
  const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits for the day
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
  const year = date.getFullYear();

  switch (mode) {
    case DateToStringModes.DMY: {
      // Return the formatted date as "DD-MM-YYYY"
      return `${day}-${month}-${year}`;
    }

    case DateToStringModes.YMD: {
      return `${year}-${month}-${date}`;
    }
  }
}

export function FormatDateToCustomString(dateString: string) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year}, ${hours}:${minutes}`;
}
