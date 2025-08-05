export type NavLinkSubChild = {
  title: string
  link?: string
}

export type NavLinkChild = {
  title: string
  link?: string
  children?: NavLinkSubChild[]
}

export type NavLink = {
  title: string
  link?: string
  protected?: boolean
  disableRedirectOnMobile?: Boolean
  children?: NavLinkChild[]
}

export const navLinks: NavLink[] = [
  {
    title: 'Home',
    link: '/'
  },
  {
    title: 'View Members',
    link: '/viewAll',
    protected: true
  },
  {
    title: 'त्रिमेस शिक्षा मिशन',
    children: [
      {
        title: 'त्रिमेस विद्या प्रचारिणी संस्थान',
        link: '/tsm/tsm-educational-institute'
      },
      {
        title: 'ज्ञान-गंगा मंच',
        link: '/tsm/gyan-ganga'
      }
    ]
  },
  {
    title: 'Social Activities',
    children: [
      {
        title: 'पंजीकृत संस्थाओं से',
        link: '/social-activities/institutions'
      },
      {
        title: 'चौखलों/इकाइयों से',
        link: '/social-activities/areas'
      }
    ]
  },
  {
    title: 'Employment News',
    link: '/employment-news'
  },
  {
    title: 'Advertisements',
    link: '/advertisements'
  },
  {
  title: 'Matrimonial',
  children: [
    {
      title: 'Register',
      link: '/marriageProfile'
    },
    {
      title: 'View Matrimonials',
      link: '/viewMatrimonials'
    }
  ]
}
]

