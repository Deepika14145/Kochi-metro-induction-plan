import React from 'react';

const SocialIcon: React.FC<{ href: string, path: string }> = ({ href, path }) => (
    <a href={href} className="text-gray-400 hover:text-metro-blue" target="_blank" rel="noopener noreferrer">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d={path} />
        </svg>
    </a>
);

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto py-12 px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div className="md:col-span-2 lg:col-span-1">
                        <a href="#" className="flex items-center space-x-3 mb-4">
                            <svg className="w-10 h-10 text-metro-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            <div>
                                <h1 className="text-xl font-bold text-white">Kochi Metro</h1>
                                <h2 className="text-sm font-semibold text-metro-blue -mt-1">AI Induction Planner</h2>
                            </div>
                        </a>
                        <p className="text-gray-400 text-sm">
                            An integrated, algorithm-driven decision-support platform for Kochi Metro to optimize nightly trainset induction planning.
                        </p>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-300">About</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm">Our Mission</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm">Leadership</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm">Contact Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm">Careers</a></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                     <div>
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-300">Resources</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm">Documentation</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm">Support Center</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm">API Reference</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm">System Status</a></li>
                        </ul>
                    </div>

                    {/* Links Column 3 */}
                    <div>
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-300">Legal</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm">Cookie Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white text-sm">Disclaimer</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Kochi Metro Rail Limited. All Rights Reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <SocialIcon href="#" path="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.28C8.28,9.09 5.11,7.38 2.9,4.79C2.53,5.42 2.33,6.15 2.33,6.94C2.33,8.43 3.1,9.75 4.18,10.53C3.46,10.5 2.8,10.32 2.2,10.03V10.08C2.2,12.21 3.73,13.99 5.82,14.42C5.46,14.51 5.08,14.56 4.69,14.56C4.42,14.56 4.15,14.53 3.89,14.48C4.45,16.25 6.04,17.51 7.9,17.55C6.38,18.73 4.4,19.42 2.29,19.42C1.94,19.42 1.6,19.4 1.25,19.36C3.14,20.64 5.4,21.33 7.82,21.33C16,21.33 20.33,14.53 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />
                        <SocialIcon href="#" path="M12 2.04C6.5 2.04 2 6.53 2 12s4.5 9.96 10 9.96c5.5 0 10-4.46 10-9.96S17.5 2.04 12 2.04zm3.95 10.22c.14.47-.33.56-.56.33-.23-.23-.5-.46-.7-.7-.4-.4-.8-.8-1.2-1.2-.2-.2-.3-.3-.5-.3s-.3.1-.5.3c-.4.4-.8.8-1.2 1.2-.2.2-.5.5-.7.7-.23.23-.7.14-.56-.33.14-.47.28-.94.42-1.4.14-.47.28-.94.42-1.4.14-.47.28-.94.42-1.4.14-.47.28-.94.42-1.4.14-.47.33-.56.56-.33.23.23.5.46.7.7.4.4.8.8 1.2 1.2.2.2.3.3.5.3s.3-.1.5-.3c.4-.4.8-.8 1.2-1.2.2-.2.5-.5.7-.7.23-.23.7-.14.56.33-.14.47-.28.94-.42 1.4-.14.47-.28.94-.42 1.4-.14.47-.28.94-.42 1.4-.14.47-.28.94-.42 1.4z" />
                        <SocialIcon href="#" path="M20,2H4C2.9,2 2,2.9 2,4V20C2,21.1 2.9,22 4,22H20C21.1,22 22,21.1 22,20V4C22,2.9 21.1,2 20,2M8.1,18.3H5.5V9.7H8.1V18.3M6.8,8.5C5.8,8.5 5,7.7 5,6.8C5,5.8 5.8,5 6.8,5C7.7,5 8.5,5.8 8.5,6.8C8.5,7.7 7.7,8.5 6.8,8.5M18.3,18.3H15.8V14.2C15.8,13.1 15.8,11.7 14.3,11.7C12.8,11.7 12.6,12.9 12.6,14.1V18.3H10V9.7H12.4V10.8H12.5C12.8,10.1 13.7,9.4 15.2,9.4C17.8,9.4 18.3,11.2 18.3,13.6V18.3Z" />

                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;