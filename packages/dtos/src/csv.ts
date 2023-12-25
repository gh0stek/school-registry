// workaround for intersection types
export type Grade = number | null | undefined

export type CSVGrades = {
  [grades: string]: Grade
}

export type CSVStudentGrades = CSVGrades & {
  student: string
}

export function isCSVStudentGrades(value: any): value is CSVStudentGrades {
  return typeof value.student === 'string'
}
