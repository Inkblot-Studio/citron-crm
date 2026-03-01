import { useState } from 'react'
import {
  PageHeader,
  PageHeaderActionButton,
  SearchBar,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  CircularScore,
  Badge,
} from '@citron-systems/citron-ui'
import { Users, Star, Building2 } from 'lucide-react'
import { MOCK_CONTACTS } from '@/lib/mock-engine'

const TAG_VARIANT: Record<string, 'success' | 'warning' | 'error' | 'default' | 'secondary' | 'outline'> = {
  Champion: 'success',
  'Decision Maker': 'warning',
  'Technical Buyer': 'default',
  'At Risk': 'error',
  'Executive Sponsor': 'warning',
  'Budget Holder': 'success',
  'End User': 'secondary',
}

function scoreTone(score: number): 'success' | 'warning' | 'error' {
  if (score >= 70) return 'success'
  if (score >= 50) return 'warning'
  return 'error'
}

export function ContactsPage() {
  const [search, setSearch] = useState('')
  const [contacts, setContacts] = useState(MOCK_CONTACTS)

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
  )

  const toggleStar = (id: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, starred: !c.starred } : c))
    )
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 sm:p-6 min-w-0">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Contacts"
          subtitle={`${contacts.length} contacts \u00B7 5 organizations`}
          icon={
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--inkblot-radius-md)] bg-[var(--inkblot-semantic-color-status-info)]">
              <Users className="h-5 w-5 text-[var(--inkblot-semantic-color-text-inverse)]" />
            </div>
          }
          action={<PageHeaderActionButton label="Add Contact" onClick={() => {}} />}
        />

        <SearchBar
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="overflow-x-auto min-w-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10" />
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <button onClick={() => toggleStar(c.id)}>
                    <Star
                      className={`h-4 w-4 ${
                        c.starred
                          ? 'fill-[var(--inkblot-semantic-color-status-warning)] text-[var(--inkblot-semantic-color-status-warning)]'
                          : 'text-[var(--inkblot-semantic-color-text-secondary)]'
                      }`}
                    />
                  </button>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-[10px] text-[var(--inkblot-semantic-color-text-secondary)]">{c.lastActivity}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5 text-[var(--inkblot-semantic-color-text-secondary)]">
                    <Building2 className="h-3 w-3" />
                    {c.company}
                  </span>
                </TableCell>
                <TableCell className="text-[var(--inkblot-semantic-color-text-secondary)]">{c.role}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {c.tags.map((tag) => (
                      <Badge key={tag} variant={TAG_VARIANT[tag] ?? 'secondary'}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <CircularScore label="" value={c.score} tone={scoreTone(c.score)} size={32} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  )
}
