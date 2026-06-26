import {
  Document, Page, Text, View, Link, Image, StyleSheet, Font,
} from '@react-pdf/renderer';
import type { CVData } from '@/lib/cv-types';

// Register all needed variants to the same WOFF — no true italic/bold exists for NotoSansJP
Font.register({
  family: 'NotoSansJP',
  fonts: [
    { src: '/fonts/NotoSansJP.woff', fontWeight: 'normal', fontStyle: 'normal' },
    { src: '/fonts/NotoSansJP.woff', fontWeight: 'normal', fontStyle: 'italic' },
    { src: '/fonts/NotoSansJP.woff', fontWeight: 'bold', fontStyle: 'normal' },
    { src: '/fonts/NotoSansJP.woff', fontWeight: 'bold', fontStyle: 'italic' },
  ],
});

function safeUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : '#';
}

const s = StyleSheet.create({
  page: { padding: 40, fontFamily: 'NotoSansJP', fontSize: 11, color: '#1a1a1a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  headerText: { flex: 1 },
  avatar: { width: 70, height: 90, borderRadius: 4 },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 3 },
  jobTitle: { fontSize: 13, color: '#555', marginBottom: 6 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14, color: '#777', fontSize: 9 },
  sectionTitle: {
    fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5,
    color: '#999', borderBottomWidth: 1, borderBottomColor: '#ddd',
    paddingBottom: 2, marginBottom: 6, marginTop: 14,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  bold: { fontWeight: 'bold' },
  sub: { color: '#666', fontSize: 9.5, marginBottom: 1 },
  bullet: { marginLeft: 10, marginBottom: 1.5 },
  tag: { color: '#888', fontSize: 9 },
});

export function CVPDFDocument({ data }: { data: CVData }) {
  const { personal, summary, experience, education, skills, projects, certificates } = data;
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View style={s.headerText}>
            <Text style={s.name}>{personal.name}</Text>
            {personal.title ? <Text style={s.jobTitle}>{personal.title}</Text> : null}
          </View>
          {personal.avatar ? <Image src={personal.avatar} style={s.avatar} /> : null}
        </View>
        <View style={s.contactRow}>
          {personal.email ? <Text>{personal.email}</Text> : null}
          {personal.phone ? <Text>{personal.phone}</Text> : null}
          {personal.location ? <Text>{personal.location}</Text> : null}
          {personal.website ? <Link src={safeUrl(personal.website)}>{personal.website}</Link> : null}
          {personal.linkedin ? <Link src={safeUrl(personal.linkedin)}>LinkedIn</Link> : null}
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
                  {proj.url ? <Link src={safeUrl(proj.url)} style={{ fontSize: 9, color: '#3b82f6' }}>Link</Link> : null}
                </View>
                {(proj.location || proj.teamSize) ? (
                  <Text style={s.sub}>
                    {[proj.location, proj.teamSize ? `Team: ${proj.teamSize}` : ''].filter(Boolean).join(' · ')}
                  </Text>
                ) : null}
                {proj.role ? <Text style={{ ...s.sub, fontStyle: 'italic' }}>{proj.role}</Text> : null}
                {proj.description ? <Text>{proj.description}</Text> : null}
                {proj.technologies.filter(Boolean).length > 0 && (
                  <Text style={s.tag}>{proj.technologies.join(', ')}</Text>
                )}
              </View>
            ))}
          </>
        ) : null}
        {certificates.length > 0 ? (
          <>
            <Text style={s.sectionTitle}>Certificates</Text>
            {certificates.map((cert, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <View style={s.rowBetween}>
                  <Text style={s.bold}>{cert.name}</Text>
                  <Text style={s.sub}>{cert.date}</Text>
                </View>
                <View style={s.rowBetween}>
                  <Text style={s.sub}>{cert.issuer}</Text>
                  {cert.url ? <Link src={safeUrl(cert.url)} style={{ fontSize: 9, color: '#3b82f6' }}>View</Link> : null}
                </View>
              </View>
            ))}
          </>
        ) : null}
      </Page>
    </Document>
  );
}
