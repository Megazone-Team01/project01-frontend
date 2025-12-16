import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateTime){
  if (!dateTime) return '';
  return dateTime.split('T')[0];
}

export function lectureStatus(startAt, endAt) {
  if (!startAt || !endAt) return '';

  const now = new Date();
  const start = new Date(startAt);
  const end = new Date(endAt);

  if (now < start) return '모집중';
  if (now >= start && now <= end) return '수강중';
  return '강의 종료';
}