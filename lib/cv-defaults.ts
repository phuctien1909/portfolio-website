import type { CVData } from './cv-types';

export const defaultCV: CVData = {
  personal: {
    name: 'Nguyen Hoang Phuc Tien',
    title: 'Test Engineer',
    email: 'nguyenhoangphuctien190903@gmail.com',
    phone: '+84 905 243 599',
    location: 'Da Nang, Viet Nam',
    website: '',
    linkedin: '',
  },
  summary:
    'Hi, I am Tien. I graduated in 2025 at Duy Tan University. I have a solid understanding of the Java programming language and more than 1 year of real project experience working with Selenium Framework using Java. My goal is to become a professional Test Engineer, contribute to innovative projects and bring real value to the community through communication and skills. I am willing to face new challenges and constantly strive to be part of future progress and success.',
  experience: [
    {
      id: 'exp-1',
      role: 'Automation Engineer',
      company: '株式会社AGEST(アジェスト)',
      location: 'Da Nang, Viet Nam',
      startDate: '10/2024',
      endDate: '02/2026',
      bullets: [
        'Implemented a robust Selenium WebDriver-based framework, resulting in a reduction in manual testing effort.',
        'Supporting team members, which increased team more productivity.',
        'Helped maintain QA documentation to support knowledge sharing and onboarding of new team members.',
        'Collaborated with members and QA teams to identify and report bugs, ensuring software quality.',
        'Gained hands-on experience with test automation tools such as Selenium, TestNG, or JUnit.',
        'Learned and applied best practices in test automation and software testing methodologies.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Information System Management',
      field: '',
      institution: 'Duy Tan University',
      startDate: '09/2021',
      endDate: '06/2025',
      gpa: '3.42/4.0',
    },
  ],
  skills: ['Selenium WebDriver', 'Java', 'SQL', 'Playwright', 'Python', 'Agile Methodology'],
  certificates: [],
  projects: [
    {
      id: 'proj-1',
      name: 'Satofuru',
      location: 'Japan',
      description:
        'Satofuru is an e-commerce project that allows users to browse products, shop online, and make payments directly through the website.',
      teamSize: '6 members',
      role: 'Automation Test Engineer (read test cases, implement them and maintain the scripts, report bugs, ...)',
      technologies: ['Selenium', 'TestNG', 'Allure report'],
      url: '',
    },
    {
      id: 'proj-2',
      name: 'ELSwifTest',
      location: 'USA',
      description:
        'ElswifTest is a finance and distribution management project that allows users to manage their receipts related to these areas.',
      teamSize: '10 members',
      role: 'Automation Test Engineer (read test cases, implement them and maintain the scripts, report bugs, ...)',
      technologies: ['Dimension SwifTest of Oracle'],
      url: '',
    },
    {
      id: 'proj-3',
      name: 'Agilis',
      location: 'Viet Nam',
      description:
        'Agilis is an internal task management tool similar to Trello and Jira, where users can create, organize, and manage their tasks. It is developed specifically for internal use within the organization.',
      teamSize: '8 members',
      role: 'Manual Tester (create and execute test cases, report bugs, ...)',
      technologies: ['Postman', 'Swagger'],
      url: '',
    },
  ],
};
