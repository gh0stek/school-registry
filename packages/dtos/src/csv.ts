// workaround for intersection types
export type Grade = number | null | undefined

export type CSVGrades = {
  [grades: string]: Grade
}

export type CSVStudentGrades = CSVGrades & {
  student: string
}
