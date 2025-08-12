import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import SearchResults from '../pages/SearchReults'

export const Route = createFileRoute('/searchResults')({
  component: SearchResults,
  validateSearch: z.object({
    q: z.string().optional(),
  }),
})
