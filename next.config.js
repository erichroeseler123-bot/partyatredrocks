/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's1.iticket.com', // SeatGeek's primary image host
      },
      {
        protocol: 'https',
        hostname: 'seatgeek.com',
      }
    ],
  },
}

module.exports = nextConfig
