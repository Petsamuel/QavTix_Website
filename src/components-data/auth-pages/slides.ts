// Title and desc stay the same for all slides (Maybe there is an update in the future)

export const signInSlides : AuthPagesSlidesData[] = [
  {
    id: 1,
    image: '/images/auth-pages/unsplash_8eNt0CQamB0.png',
    title: 'Discover Your Next Experience',
    description: 'From Concerts to travel, find and book tickets for everything you love'
  },
  {
    id: 2,
    image: '/images/auth-pages/unsplash_6vAjp0pscX0.png',
    title: 'Discover Your Next Experience',
    description: 'From Concerts to travel, find and book tickets for everything you love'
  },
  {
    id: 3,
    image: '/images/auth-pages/unsplash_67ruAEYmp4c.png',
    title: 'Discover Your Next Experience',
    description: 'From Concerts to travel, find and book tickets for everything you love'
  },
  {
    id: 4,
    image: '/images/auth-pages/unsplash_E2vA_AMubQ0.png',
    title: 'Discover Your Next Experience',
    description: 'From Concerts to travel, find and book tickets for everything you love'
  },
  {
    id: 5,
    image: '/images/auth-pages/unsplash_F2KRf_QfCqw.png',
    title: 'Discover Your Next Experience',
    description: 'From Concerts to travel, find and book tickets for everything you love'
  }
]



export const signUpSlides : AuthPagesSlidesData[] = [
  {
    id: 1,
    image: '/images/auth-pages/unsplash_B-6AoACfi6o.png',
    title: 'Discover Your Next Experience',
    description: 'From Concerts to travel, find and book tickets for everything you love'
  },
  {
    id: 2,
    image: '/images/auth-pages/unsplash_-xUwHb6uaUo.png',
    title: 'Discover Your Next Experience',
    description: 'From Concerts to travel, find and book tickets for everything you love'
  },
  {
    id: 3,
    image: '/images/auth-pages/unsplash_Lpk_o-XeRWo.png',
    title: 'Create Events, Sell Easily, Grow Reach.',
    description: 'Create events quickly, sell tickets seamlessly, and reach a wider audience with built-in promotion and tracking tools.'
  },
  {
    id: 4,
    image: '/images/auth-pages/unsplash_6qekp4-XZHI.png',
    title: 'Create Events, Sell Easily, Grow Reach.',
    description: 'Create events quickly, sell tickets seamlessly, and reach a wider audience with built-in promotion and tracking tools.'
  },
  {
    id: 5,
    image: '/images/auth-pages/unsplash_rE9vgD_TXgM.png',
    title: 'Create Events, Sell Easily, Grow Reach.',
    description: 'Create events quickly, sell tickets seamlessly, and reach a wider audience with built-in promotion and tracking tools.'
  }
]



export const slides_onlyImages : string[] = [
  ...signInSlides, ...signUpSlides
].map(v => v.image)