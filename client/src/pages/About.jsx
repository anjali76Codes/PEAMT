import React from 'react';
import examManagementImg from '../assets/aboutpage/management.gif';
import secureAuthenticationImg from '../assets/aboutpage/security.gif';
import applicationFormsImg from '../assets/aboutpage/applicationform.png';
import aiProctoringImg from '../assets/aboutpage/ai.gif';
import adminDashboardImg from '../assets/aboutpage/dashboard.gif';
import securityFeaturesImg from '../assets/aboutpage/secureplatform.gif';
import securityFeatures2Img from '../assets/aboutpage/secureplatform2.gif'; // Add this image to your assets folder
import innovationImg from '../assets/aboutpage/innovativeTech.gif'; // Add this image to your assets folder

const features = [
    {
        title: 'Comprehensive Exam Management',
        description: 'Seamlessly manage competitive, online, and offline exams with real-time monitoring and automated proctoring.',
        imgSrc: examManagementImg,
    },
    {
        title: 'Secure Authentication',
        description: 'Ensure the security of exams with advanced encryption, multi-factor authentication, and AI-powered identity verification.',
        imgSrc: secureAuthenticationImg,
    },
    {
        title: 'Student Application Forms',
        description: 'User-friendly forms that guide students through the registration process with automated data validation.',
        imgSrc: applicationFormsImg,
    },
    {
        title: 'AI-Powered Proctoring',
        description: 'Leverage AI to monitor exams and detect suspicious activities in real-time, ensuring exam integrity.',
        imgSrc: aiProctoringImg,
    },
    {
        title: 'Admin Dashboard',
        description: 'Admins can easily create and manage exams, track progress, and analyze performance through a comprehensive dashboard.',
        imgSrc: adminDashboardImg,
    },
];

const About = () => {
    return (
        <div className="bg-gradient-to-r from-cyan-600 to-indigo-300 p-10">
            <h1 className="text-center text-4xl font-bold text-white mb-12 mt-10 animate-fadeIn">About Our Platform</h1>
            <p className="text-center text-lg text-white mb-16 max-w-3xl mx-auto animate-fadeIn">
                Our proctored exam automation and monitoring platform offers a comprehensive solution for institutions to conduct exams securely and efficiently. From student registration to result declaration, every aspect of the examination process is streamlined.
            </p>

            <div className="grid gap-8 md:grid-cols-3">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="relative  rounded-xl bg-sky-800 p-4 shadow-lg overflow-hidden transform transition-transform duration-300 animate-fadeIn"
                    >
                        <img
                            src={feature.imgSrc}
                            alt={feature.title}
                            className="w-full h-96 bg-sky-800"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="p-6 text-center text-[#C9DABF] transform transition-transform duration-500 translate-y-10 hover:translate-y-0">
                                <h2 className="text-xl font-bold mb-4">{feature.title}</h2>
                                <p>{feature.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <section className="platform-security text-center mt-16">
                <h2 className="text-3xl font-bold text-[#C9DABF] mb-8 animate-fadeIn">Platform Security</h2>
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
                    <div className='rounded-lg flex flex-row'>
                    <img
                        src={securityFeaturesImg}
                        alt="Platform Security Features"
                        className="h-64 rounded-lg mb-6 mx-auto"
                    />
                    <img
                        src={securityFeatures2Img}
                        alt="Platform Security Features"
                        className="h-64 rounded-lg mb-6 mx-auto"
                    />
                    </div>
                    <p className="text-lg text-gray-700">
                        Our platform is built with top-notch security features to protect exam integrity and user data. We employ robust encryption methods, continuous monitoring, and advanced fraud detection to ensure a secure testing environment.
                    </p>
                </div>
            </section>

            <section className="innovation text-center mt-16">
                <h2 className="text-3xl font-bold text-[#C9DABF] mb-8 animate-fadeIn">Innovative Technology</h2>
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
                    <img
                        src={innovationImg}
                        alt="Innovative Technology"
                        className="w-96 h-64 object-cover rounded-lg mb-6 mx-auto"
                    />
                    <p className="text-lg text-gray-700">
                        Our platform integrates cutting-edge technologies to enhance the examination experience. From AI-powered proctoring to real-time analytics, we are committed to pushing the boundaries of exam automation and monitoring.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default About;