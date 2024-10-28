export type SuggestionType =
  | 'insert'
  | 'delete'
  | 'property-change'
  | 'split'
  | 'join'
  | 'link-change'
  | 'style-change'
  | 'image-change'
  | 'indent-change'
  | 'insert-table'
  | 'delete-table'
  | 'insert-table-row'
  | 'duplicate-table-row'
  | 'delete-table-row'
  | 'insert-table-column'
  | 'delete-table-column'
  | 'duplicate-table-column'
  | 'block-type-change'
  | 'clear-formatting'
  | 'align-change'

export type SuggestionSummaryType =
  | SuggestionType
  | 'replace'
  | 'add-link'
  | 'delete-link'
  | 'insert-image'
  | 'delete-image'
  | 'insert-divider'
  | 'delete-divider'
