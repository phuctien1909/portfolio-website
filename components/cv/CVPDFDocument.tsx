import {
  Document, Page, Text, View, Link, StyleSheet,
} from '@react-pdf/renderer';
import type { CVData } from '@/lib/cv-types';

function safeUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : '#';
}

const s = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#1a1a1a' },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 3 },
  jobTitle: { fontSize: 12, color: '#555', marginBottom: 6 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14, color: '#777', fontSize: 8 },
  sectionTitle: {
    fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5,
    color: '#999', borderBottomWidth: 1, borderBottomColor: '#ddd',
    paddingBottom: 2, marginBottom: 6, marginTop: 14,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  bold: { fontWeight: 'bold' },
  sub: { color: '#666', fontSize: 8.5, marginBottom: 1 },
  bullet: { marginLeft: 10, marginBottom: 1.5 },
  tag: { color: '#888', fontSize: 8 },
});

export function CVPDFDocument({ data }: { data: CVData }) {
  const { personal, summary, experience, education, skills, projects } = data;
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{personal.name}</Text>
        {personal.title && <Text style={s.jobTitle}>{personal.title}</Text>}
        <View style={s.contactRow}>
          {personal.email && <Text>{personal.email}</Text>}
          {personal.phone && <Text>{personal.phone}</Text>}
          {personal.location && <Text>{personal.location}</Text>}
          {personal.website && <Link src={safeUrl(personal.website)}>{personal.website}</Link>}
          {personal.linkedin && <Link src={safeUrl(personal.linkedin)}>LinkedIn</Link>}
        </View>

        {summary ? (
          <>
            <Text style={s.sectionTitle}>Summary</Text>
            <Text>{summary}</Text>
          </>
        ) : null}

        {experience.length > 0 ? (
          <>
            <Text style={s.sectionTitle}>Experience</Text>
            {experience.map((exp, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <View style={s.rowBetween}>
                  <Text style={s.bold}>{exp.role}</Text>
                  <Text style={s.sub}>{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</Text>
                </View>
                <Text style={s.sub}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</Text>
                {exp.bullets.filter(Boolean).map((b, j) => (
                  <Text key={j} style={s.bullet}>• {b}</Text>
                ))}
              </View>
            ))}
          </>
        ) : null}

        {education.length > 0 ? (
          <>
            <Text style={s.sectionTitle}>Education</Text>
            {education.map((edu, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <View style={s.rowBetween}>
                  <Text style={s.bold}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</Text>
                  <Text style={s.sub}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</Text>
                </View>
                <Text style={s.sub}>{edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</Text>
              </View>
            ))}
          </>
        ) : null}

        {skills.length > 0 ? (
          <>
            <Text style={s.sectionTitle}>Skills</Text>
            <Text>{skills.join(' · ')}</Text>
          </>
        ) : null}

        {projects.length > 0 ? (
          <>
            <Text style={s.sectionTitle}>Projects</Text>
            {projects.map((proj, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <View style={s.rowBetween}>
                  <Text style={s.bold}>{proj.name}</Text>
                  {proj.url ? <Link src={safeUrl(proj.url)} style={{ fontSize: 8, color: '#3b82f6' }}>Link</Link> : null}
                </View>
                {proj.description ? <Text>{proj.description}</Text> : null}
                {proj.technologies.filter(Boolean).length > 0 && (
                  <Text style={s.tag}>{proj.technologies.join(', ')}</Text>
                )}
              </View>
            ))}
          </>
        ) : null}
      </Page>
    </Document>
  );
}
