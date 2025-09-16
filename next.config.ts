import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
  images: {
		remotePatterns: [
			{
				hostname: "rxqhuxndaspxtiqlxnbj.supabase.co",
			},
			{
				hostname: "localhost",
			},
			{
				hostname: "res.cloudinary.com",
			}
		],
	},
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);