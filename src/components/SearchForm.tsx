import { FormEvent, useState } from 'react'
import { z } from 'zod'
import type { SearchFormValues, SortOption } from '../types/crypto'

const searchSchema = z.object({
  query: z
    .string()
    .trim()
    .min(2, 'Ingresá al menos 2 caracteres para buscar.'),
  sort: z.enum(['market_cap_desc', 'price_desc', 'price_asc'], {
    errorMap: () => ({ message: 'Seleccioná un criterio de orden válido.' }),
  }),
})

interface SearchFormProps {
  initialValues: SearchFormValues
  onApply: (values: SearchFormValues) => void
}

type FieldErrors = Partial<Record<keyof SearchFormValues, string>>

export default function SearchForm({ initialValues, onApply }: SearchFormProps) {
  const [query, setQuery] = useState(initialValues.query)
  const [sort, setSort] = useState<SortOption>(initialValues.sort)
  const [errors, setErrors] = useState<FieldErrors>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = searchSchema.safeParse({ query, sort })

    if (!result.success) {
      const nextErrors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof SearchFormValues | undefined
        if (field && !nextErrors[field]) nextErrors[field] = issue.message
      }
      setErrors(nextErrors)
      return
    }

    setErrors({})
    onApply(result.data)
  }

  return (
    <form className="search-form" onSubmit={handleSubmit} noValidate>
      <div className="field-group">
        <label htmlFor="query">Buscar criptomoneda</label>
        <input
          id="query"
          name="query"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-invalid={Boolean(errors.query)}
          aria-describedby={errors.query ? 'query-error' : undefined}
          placeholder="Ej.: bit, eth, sol"
        />
        {errors.query && (
          <p className="field-error" id="query-error" role="alert">
            {errors.query}
          </p>
        )}
      </div>

      <div className="field-group">
        <label htmlFor="sort">Ordenar por</label>
        <select
          id="sort"
          name="sort"
          value={sort}
          onChange={(event) => setSort(event.target.value as SortOption)}
          aria-invalid={Boolean(errors.sort)}
          aria-describedby={errors.sort ? 'sort-error' : undefined}
        >
          <option value="market_cap_desc">Capitalización de mercado</option>
          <option value="price_desc">Precio: mayor a menor</option>
          <option value="price_asc">Precio: menor a mayor</option>
        </select>
        {errors.sort && (
          <p className="field-error" id="sort-error" role="alert">
            {errors.sort}
          </p>
        )}
      </div>

      <button className="primary-button" type="submit">
        Aplicar búsqueda
      </button>
    </form>
  )
}
