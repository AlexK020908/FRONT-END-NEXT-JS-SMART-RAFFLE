/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        loader: "akamai",
        path: "",
    },
}

module.exports = nextConfig

//add
/*
  images: {
    loader: 'akamai',
    path: '',
  },

  to fix issues 
*/
