import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generatePassword = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const formatTimeTo12Hour = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = (((hours + 11) % 12) + 1).toString().padStart(2, "0");
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

export const filterAttendanceByDay = (data: any, targetDay: string) => {
  targetDay = format(targetDay, "yyyy-MM-dd"); // Ensure targetDay is in 'YYYY-MM-DD' format

  return data.map((item: any) => {
    const attendanceData = item.attendance[0] ? item.attendance[0].attendanceData[targetDay] : null;

    return {
      id: item.id,
      ...attendanceData,
    };
  });
};

export function formatCurrency(num: number, decimals = 2) {
  if (isNaN(num)) return "0"; // Returns zero if invalid

  const numAbs = Math.abs(num);
  let formattedNum;

  if (numAbs >= 10000000) {
    // 1 crore or more
    formattedNum = "৳ " + (num / 10000000).toFixed(decimals) + " Cr";
  } else if (numAbs >= 100000) {
    // 1 lakh or more
    formattedNum = "৳ " + (num / 100000).toFixed(decimals) + " Lac";
  } else if (numAbs >= 1000) {
    // 1 thousand or more
    formattedNum = "৳ " + (num / 1000).toFixed(decimals) + " K";
  } else {
    formattedNum = "৳ " + num.toFixed(decimals);
  }

  // Handle negative numbers
  if (num < 0) {
    formattedNum = "৳ " + "-" + formattedNum;
  }

  return formattedNum;
}

export const exportToExcel = (data: any[], fileName: string, shouldTranspose: boolean = false) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Transpose data if needed
  let worksheet;
  if (shouldTranspose) {
    // Convert JSON data to an array of arrays (rows)
    const rows = data.map((obj) => Object.values(obj));
    // Extract headers (column names)
    const headers = Object.keys(data[0]);
    // Add headers as the first row
    rows.unshift(headers);
    // Transpose rows ↔ columns
    const transposedData = rows[0].map((_, i) => rows.map((row) => row[i]));
    // Create worksheet from transposed data
    worksheet = XLSX.utils.aoa_to_sheet(transposedData);
  } else {
    // Default behavior (no transposition)
    worksheet = XLSX.utils.json_to_sheet(data);
  }

  // Add the worksheet to the workbook
  const truncatedSheetName = fileName.substring(0, 31);
  XLSX.utils.book_append_sheet(workbook, worksheet, truncatedSheetName);

  // Generate and download the Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName || "data"}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
};

export function capitalizeFirstLetter(str: string) {
  if (!str) return str; // handle empty string
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function getGradeBasedOnMarks(marks: number) {
  if (marks >= 80 && marks <= 100) {
    return { letterGrade: "A+", gradePoint: 5 };
  } else if (marks >= 70 && marks < 80) {
    return { letterGrade: "A", gradePoint: 4 };
  } else if (marks >= 60 && marks < 70) {
    return { letterGrade: "A-", gradePoint: 3.5 };
  } else if (marks >= 50 && marks < 60) {
    return { letterGrade: "B", gradePoint: 3 };
  } else if (marks >= 40 && marks < 50) {
    return { letterGrade: "C", gradePoint: 2 };
  } else if (marks >= 33 && marks < 40) {
    return { letterGrade: "D", gradePoint: 1 };
  } else if (marks >= 0 && marks < 33) {
    return { letterGrade: "F", gradePoint: 0 };
  } else {
    return { letterGrade: "Invalid", gradePoint: 0 };
  }
}

export function getLetterGradeBasedOnPoints(gradePoint: number) {
  if (gradePoint > 5) gradePoint = 5;
  if (gradePoint === 5.0) {
    return { letterGrade: "A+", gradePoint };
  } else if (gradePoint >= 4.0 && gradePoint <= 4.99) {
    return { letterGrade: "A", gradePoint };
  } else if (gradePoint >= 3.5 && gradePoint <= 3.99) {
    return { letterGrade: "A-", gradePoint };
  } else if (gradePoint >= 3.0 && gradePoint <= 3.49) {
    return { letterGrade: "B", gradePoint };
  } else if (gradePoint >= 2.0 && gradePoint <= 2.99) {
    return { letterGrade: "C", gradePoint };
  } else if (gradePoint >= 1.0 && gradePoint <= 1.99) {
    return { letterGrade: "D", gradePoint };
  } else if (gradePoint >= 0.0 && gradePoint <= 0.99) {
    return { letterGrade: "F", gradePoint };
  } else {
    return { letterGrade: "Invalid", gradePoint: 0 };
  }
}

export const transformMarksBySubject = (marks: any) => {
  const subjects: Record<string, { subject: string; exams: any }> = {};

  marks.forEach((mark: any, index: number) => {
    if (!subjects[mark.subject]) {
      subjects[mark.subject] = {
        subject: mark.subject,
        exams: [],
      };
    }
    subjects[mark.subject].exams.push({
      examNo: `Exam No. ${index + 1}`,
      date: mark.date,
      grade: mark.grade,
      gradePoint: mark.gradePoint,
      obtainedMark: mark.obtainedMark,
      totalMarks: +mark.examsTotalMarks,
      highestMark: +mark.highestMark,
    });
  });

  return Object.values(subjects).map((subject) => {
    const totalMarks = subject.exams.reduce((sum: number, exam: any) => {
      // Skip if "A" or not a valid number
      if (exam.obtainedMark === "A" || isNaN(Number(exam.obtainedMark))) {
        return sum;
      }
      return sum + Number(exam.obtainedMark); // Convert to number safely
    }, 0);
    const maxPossible = subject.exams.reduce((sum: any, exam: any) => sum + exam.totalMarks, 0);
    const markIn100 = (+totalMarks / +maxPossible) * 100;
    const grade = getGradeBasedOnMarks(markIn100);

    return {
      ...subject,
      totalObtained: totalMarks.toString(),
      totalPossible: maxPossible.toString(),
      ...grade,
    };
  });
};

export function getTotalGradePointsByStudent(students: any) {
  return students.reduce((acc: any, student: any) => {
    const existingStudent = acc.find((s: any) => s.id === student.id);

    let totalGradePoints = 0;
    Object.values(student).forEach((item: any) => {
      if (item.subject && typeof item.gradePoint === "number") {
        totalGradePoints += item.gradePoint;
      }
    });

    if (existingStudent) {
      existingStudent.totalGradePoints += totalGradePoints;
    } else {
      acc.push({ id: student.id, totalGradePoints });
    }

    return acc;
  }, [] as { id: number; totalGradePoints: number }[]);
}

export function calculatePositions(students: any[]) {
  // Sort by fail status first (0 comes first), then by totalGradePoints descending, then by total marks descending
  const sortedStudents = [...students].sort((a, b) => {
    //  const aFail = a.isFail ? 1 : 0; // Convert boolean to number
    //  const bFail = b.isFail ? 1 : 0; // Convert boolean to number
    //  if (aFail !== bFail) return aFail - bFail;
    if (a.isFail !== b.isFail) {
      return a.isFail - b.isFail; // Students with no fails come first
    }
    if (b.totalGradePoint !== a.totalGradePoint) {
      return b.totalGradePoint - a.totalGradePoint; // Then sort by grade points descending
    }
    return parseFloat(b.totalObtained) - parseFloat(a.totalObtained); // Finally sort by total marks descending
  });

  // Assign positions - only consider students tied if ALL criteria match
  let lastPosition = 1; // Start at position 1
  for (let i = 0; i < sortedStudents.length; i++) {
    if (i === 0) {
      sortedStudents[i].position = 1; // First student is always 1
    } else {
      // Compare with the FIRST student in the current tied group
      const firstInGroup = sortedStudents[lastPosition - 1];
      const isTied =
        sortedStudents[i].totalGradePoint === firstInGroup.totalGradePoint &&
        sortedStudents[i].totalObtained === firstInGroup.totalObtained;

      if (isTied) {
        // Share the same position as the first in the group
        sortedStudents[i].position = firstInGroup.position;
      } else {
        // Increment position normally (no skipping)
        sortedStudents[i].position = lastPosition + 1;
      }
    }
    lastPosition = sortedStudents[i].position; // Update lastPosition
  }

  // Return to original order but with position added
  const result = students.map((student: any) => {
    const found = sortedStudents.find((s) => s.id === student.id);
    return { ...student, position: found.position };
  });

  return result;
}

export function getPreviousMonth(currentYearMonth: string): string {
  const [year, month] = currentYearMonth.split("-").map(Number);
  const date = new Date(year, month - 1, 1); // month is 0-indexed in Date
  date.setMonth(date.getMonth() - 1);

  const prevYear = date.getFullYear();
  const prevMonth = String(date.getMonth() + 1).padStart(2, "0");
  return `${prevYear}-${prevMonth}`;
}
