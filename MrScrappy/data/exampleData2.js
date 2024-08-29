const data = [
    {
      jobTitle: 'Gaming Recruiter',
      companyName: 'Seedify',
      timePosted: '2 months ago',
      jobSearchLocation: 'Philippines',
      applicantsStatus: null,
      directLinkedInLink: 'https://www.linkedin.com/company/seedify?trk=public_jobs_topcard-org-name'
    },
    {
      jobTitle: 'Game Tester',
      companyName: 'GoTeam',
      timePosted: '2 weeks ago',
      jobSearchLocation: 'Philippines',
      applicantsStatus: 'Over 200 applicants',
      directLinkedInLink: 'https://ph.linkedin.com/company/goteamph?trk=public_jobs_topcard-org-name'
    },
    {
      jobTitle: 'Game Tester Opportunity!',
      companyName: 'TransPerfect',
      timePosted: '1 month ago',
      jobSearchLocation: 'Philippines',
      applicantsStatus: 'Over 200 applicants',
      directLinkedInLink: 'https://www.linkedin.com/company/transperfect?trk=public_jobs_topcard-org-name'
    },
    {
      jobTitle: 'Aspire Future Leaders Program - People',
      companyName: 'Coca-Cola Beverages Philippines',
      timePosted: '3 weeks ago',
      jobSearchLocation: 'Taguig, National Capital Region, Philippines',
      applicantsStatus: 'Over 200 applicants',
      directLinkedInLink: 'https://ph.linkedin.com/company/coca_cola_beverages_philippines?trk=public_jobs_topcard-org-name'
    },
    {
      jobTitle: 'Sales Support Executive',
      companyName: 'Cebu Pacific Air',
      timePosted: '2 weeks ago',
      jobSearchLocation: 'Pasay, National Capital Region, Philippines',
      applicantsStatus: 'Over 200 applicants',
      directLinkedInLink: 'https://ph.linkedin.com/company/cebupacificair?trk=public_jobs_topcard-org-name'
    },
    {
      jobTitle: 'Account Executive (Passenger Sales)',
      companyName: 'Cebu Pacific Air',
      timePosted: '1 day ago',
      jobSearchLocation: 'Pasay, National Capital Region, Philippines',
      applicantsStatus: null,
      directLinkedInLink: 'https://ph.linkedin.com/company/cebupacificair?trk=public_jobs_topcard-org-name'
    },
    {
      jobTitle: 'Game Developer',
      companyName: 'Animoca Brands',
      timePosted: '1 month ago',
      jobSearchLocation: 'Philippines',
      applicantsStatus: null,
      directLinkedInLink: 'https://hk.linkedin.com/company/animoca-brands?trk=public_jobs_topcard-org-name'
    },
    {
      jobTitle: 'Unity Game Developer',
      companyName: 'BreederDAO',
      timePosted: '1 month ago',
      jobSearchLocation: 'Philippines',
      applicantsStatus: 'Over 200 applicants',
      directLinkedInLink: 'https://vg.linkedin.com/company/breederdao?trk=public_jobs_topcard-org-name'
    },
    {
      jobTitle: '3D Closet Modeller',
      companyName: 'RemoteVA',
      timePosted: '4 weeks ago',
      jobSearchLocation: 'Philippines',
      applicantsStatus: 'Over 200 applicants',
      directLinkedInLink: 'https://www.linkedin.com/company/remoteva?trk=public_jobs_topcard-org-name'
    },
    {
      jobTitle: 'Filipino Language Game Tester (Editor/Proofreader)',
      companyName: 'PTW',
      timePosted: '1 month ago',
      jobSearchLocation: 'Makati, National Capital Region, Philippines',
      applicantsStatus: null,
      directLinkedInLink: 'https://www.linkedin.com/company/ptwintl?trk=public_jobs_topcard-org-name'
    },
    {
      jobTitle: 'Jr./Sr. Mobile Game Programmer',
      companyName: 'Kooapps',
      timePosted: '1 week ago',
      jobSearchLocation: 'Makati, National Capital Region, Philippines',
      applicantsStatus: 'Be among the first 25 applicants',
      directLinkedInLink: 'https://www.linkedin.com/company/kooapps?trk=public_jobs_topcard-org-name'
    },
    {
      jobTitle: 'VR Video game tester (night shift)',
      companyName: 'Secret 6',
      timePosted: '6 days ago',
      jobSearchLocation: 'Pasig, National Capital Region, Philippines',
      applicantsStatus: null,
      directLinkedInLink: 'https://www.linkedin.com/company/secret6?trk=public_jobs_topcard-org-name'
    },
    {
      jobTitle: '3D Artist',
      companyName: 'Kooapps',
      timePosted: '6 months ago',
      jobSearchLocation: 'Makati, National Capital Region, Philippines',
      applicantsStatus: null,
      directLinkedInLink: 'https://www.linkedin.com/company/kooapps?trk=public_jobs_topcard-org-name'
    },
    {
      jobTitle: 'Multimedia Artist',
      companyName: 'Kooapps',
      timePosted: '1 year ago',
      jobSearchLocation: 'Makati, National Capital Region, Philippines',
      applicantsStatus: 'Be among the first 25 applicants',
      directLinkedInLink: 'https://www.linkedin.com/company/kooapps?trk=public_jobs_topcard-org-name'
    },
    {
      jobTitle: '3D Level Designer',
      companyName: 'BreederDAO',
      timePosted: '2 months ago',
      jobSearchLocation: 'Makati, National Capital Region, Philippines',
      applicantsStatus: null,
      directLinkedInLink: 'https://vg.linkedin.com/company/breederdao?trk=public_jobs_topcard-org-name'
    },
    {
      jobTitle: 'Jr./Sr. Data Analyst',
      companyName: 'Kooapps',
      timePosted: '1 year ago',
      jobSearchLocation: 'Makati, National Capital Region, Philippines',
      applicantsStatus: 'Be among the first 25 applicants',
      directLinkedInLink: 'https://www.linkedin.com/company/kooapps?trk=public_jobs_topcard-org-name'
    },
    {
      jobTitle: 'Senior Project Manager',
      companyName: 'Kooapps',
      timePosted: '3 months ago',
      jobSearchLocation: 'Makati, National Capital Region, Philippines',
      applicantsStatus: 'Be among the first 25 applicants',
      directLinkedInLink: 'https://www.linkedin.com/company/kooapps?trk=public_jobs_topcard-org-name'
    },
    {
      jobTitle: '3D Junior Artist, Digital Studios',
      companyName: 'Amazon',
      timePosted: '1 day ago',
      jobSearchLocation: 'Pasay, National Capital Region, Philippines',
      applicantsStatus: null,
      directLinkedInLink: 'https://www.linkedin.com/company/amazon?trk=public_jobs_topcard-org-name'
    },
    {
      companyName: 'Skillsearch',
      timePosted: '6 months ago',
      jobSearchLocation: 'Metro Manila',
      applicantsStatus: 'Be among the first 25 applicants',
      directLinkedInLink: 'https://uk.linkedin.com/company/skillsearch?trk=public_jobs_topcard-org-name'
    },
    {
      jobTitle: 'Virtual Assistant (OSD0002)',
      companyName: 'hammerjack',
      timePosted: '1 month ago',
      jobSearchLocation: 'Makati, National Capital Region, Philippines',
      applicantsStatus: null,
      directLinkedInLink: 'https://au.linkedin.com/company/hammerjack?trk=public_jobs_topcard-org-name'
    }
  ]


module.exports = { data }