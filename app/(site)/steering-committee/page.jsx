"use client";

import Link from "next/link";
import Image from "next/image";

import {
    UsersRound,
    Linkedin,
    Award,
} from "lucide-react";

const leadership = [
    {
        name: "Deman Yusuf",
        role: "Chair, Steering Committee",
        position: "Lecturer, Institute of Social Work",
        country: "🇹🇿 Tanzania",
        image: "/committee/deman-yusuf.jpeg",
        linkedin: "https://www.linkedin.com/in/deman-yusuf-26125916a/",
        bio: "Deman Yusuf is a medical sociologist and educator with over 15 years of experience in early childhood development, gender equality, and social policy. She is passionate about translating research into practical solutions that strengthen childcare systems, support caregivers, and improve outcomes for children and families. As Chair of the Steering Committee, she provides strategic leadership, promotes evidence-informed decision-making, and fosters collaboration across sectors to advance inclusive childcare systems throughout Africa.",
        flag: "/flags/tz.png"
    },

    {
        name: "Janeffer Muteti",
        role: "Steering Committee Secretariat",
        position: "Coordinator, Collaborative Action for Childcare",
        country: "🇰🇪 Kenya",
        image: "/committee/janeffer-muteti.jpeg",
        linkedin:
            "https://www.linkedin.com/in/janeffer-mwikali-6232111a1/",
        bio: "Janeffer Muteti is a strategic leader with expertise in advocacy, policy engagement, programme management, stakeholder coordination, fundraising, and research. Her work focuses on strengthening childcare systems, responsive caregiving, women’s economic empowerment, and community development. As Secretariat, she oversees coordination, partnership development, resource mobilization, and knowledge management to support the successful delivery of Africa Childcare Forum 2026.",
        flag: "/flags/ke.png"
    },
];

const members = [
    {
        name: "Bill Odindo Otieno",
        role: "Policy & Child Protection",
        position: "Program and Policy Specialist",
        country: "🇰🇪 Kenya",
        image: "/committee/bill-odindo.jpeg",
        linkedin: "https://www.linkedin.com/in/bill-odindo-175382a0/",
        bio: "Bill Odindo Otieno has more than 20 years of experience in public health, child protection, policy advocacy, and community development. He works to strengthen systems that safeguard children, promote accountability, and support child and adolescent wellbeing.",
        flag: "/flags/ke.png"
    },

    {
        name: "James Githui K",
        role: "Program Design & Speakers Lead",
        position: "Head of Programming, Artemis Health Network",
        country: "🇰🇪 Kenya",
        image: "/committee/james-githui.jpeg",
        linkedin: "https://www.linkedin.com/in/jamesgithuik57/",
        bio: "James Githui K is a public health and child protection specialist with more than 18 years of experience managing large-scale donor-funded programmes. His expertise spans child protection, safeguarding, programme leadership, policy advocacy, and resource mobilization.",
        flag: "/flags/ke.png"
    },

    {
        name: "Fayudatu Yakubu",
        role: "Fundraising & Sponsorship Lead",
        position: "Head of Global Partnerships, Lively Minds",
        country: "🇬🇭 Ghana",
        image: "/committee/fayudatu-yakubu.jpeg",
        linkedin:
            "https://www.linkedin.com/in/fayudatu-yakubu-pmp-351ba891/",
        bio: "Fayudatu Yakubu is a partnerships and resource mobilization specialist with extensive experience working with governments, bilateral agencies, foundations, and development partners. She leads efforts to secure strategic investments and partnerships.",
        flag: "/flags/gh.png"
    },

    {
        name: "Zibiso Malejane",
        role: "Partnerships & Government Engagement",
        position:
            "Executive & Stakeholder Relations Officer, Learn To Play",
        country: "🇧🇼 Botswana",
        image: "/committee/zibiso-malejane.jpeg",
        linkedin: "https://www.linkedin.com/in/zibiso-m-3978a4b2/",
        bio: "Zibiso Malejane is a child welfare and youth development professional with expertise in stakeholder engagement, policy advocacy, and community-centered programming.",
        flag: "/flags/bw.png"
    },

    {
        name: "Maggie Kuchonde",
        role: "Practitioner Participation Lead",
        position: "Lecturer, University of Malawi",
        country: "🇲🇼 Malawi",
        image: "/committee/maggie-kuchonde.png",
        linkedin:
            "https://www.linkedin.com/in/maggie-kuchonde-1442591ba/",
        bio: "Maggie Kuchonde is an Early Childhood Development specialist with over 15 years of experience in child protection, parenting support, literacy development, and ECD in emergency settings.",
        flag: "/flags/mw.png"
    },

    {
        name: "Bijal Lal",
        role: "Research & Policy Outputs",
        position:
            "Deputy Principal, Almuntazir Special Education Needs (AMSEN)",
        country: "🇹🇿 Tanzania",
        image: "/committee/bijal-lal.jpeg",
        linkedin: "https://www.linkedin.com/in/bijal-lal-831975194/",
        bio: "Bijal Lal is a special education practitioner and advocate for inclusive education and disability rights. Her work focuses on ensuring that every child, including children with disabilities, has access to quality learning opportunities.",
        flag: "/flags/tz.png"
    },

    {
        name: "Gelito Inácio Franco Sululu",
        role: "Partnerships & Government Engagement – Lusophone Africa",
        position: "Founder & CEO, Associação Galito Preto",
        country: "🇲🇿 Mozambique",
        image: "/committee/gelito-sululu.png",
        linkedin:
            "https://www.linkedin.com/in/gelito-in%C3%A1cio-franco-sululu-5a46a8184/",
        bio: "Gelito Sululu is a sustainable development and conservation specialist with experience in climate action, food security, community empowerment, and youth leadership.",
        flag: "/flags/mz.png"
    },

    {
        name: "Wawire Issa Efumbi",
        role: "Community Engagement & Youth Development",
        position:
            "Development and Humanitarian Programmes Specialist",
        country: "🇰🇪 Kenya",
        image: "/committee/wawire-efumbi.png",
        linkedin: "https://www.linkedin.com/in/wawire-efumbi/",
        bio: "Wawire Issa Efumbi is a social development practitioner with over a decade of experience in child protection, youth empowerment, psychosocial support, and community resilience.",
        flag: "/flags/ke.png"
    },
];

export default function SteeringCommitteePage() {
    return (<main className="bg-white">

        {/* HERO */}
        <section className="pt-32 pb-20 bg-[#FFF6F4]">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center max-w-4xl mx-auto">
                    <UsersRound
                        size={60}
                        className="mx-auto text-[#E5553C]"
                    />

                    <h1 className="mt-6 text-5xl font-extrabold text-gray-900">
                        Meet the Steering Committee
                    </h1>

                    <p className="mt-8 text-lg text-gray-700 leading-relaxed">
                        The Africa Childcare Forum 2026 Steering Committee
                        comprises a diverse group of leaders, practitioners,
                        researchers, policymakers, and advocates committed to
                        advancing childcare and early childhood development
                        across Africa.
                    </p>

                    <p className="mt-4 text-lg text-gray-700 leading-relaxed">
                        Together, they are working to create a dynamic platform
                        that brings together governments, development partners,
                        practitioners, academics, funders, and communities to
                        strengthen childcare systems and improve outcomes for
                        children and families across the continent.
                    </p>
                </div>
            </div>
        </section>

        {/* CHAIR + SECRETARIAT */}
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-6">

                <div className="grid lg:grid-cols-2 gap-10">
                    {leadership.map((person) => (
                        <div
                            key={person.name}
                            className="bg-white rounded-3xl shadow-xl border border-[#FFE3DF] overflow-hidden"
                        >
                            <img
                                src={person.image}
                                alt={person.name}
                                className="w-full h-96 object-cover"
                            />

                            <div className="p-8">
                                <div className="inline-flex items-center gap-2 bg-[#FFF4F0] text-[#E5553C] px-4 py-2 rounded-full text-sm font-semibold">
                                    <Award size={16} />
                                    Leadership
                                </div>

                                <h2 className="mt-5 text-3xl font-bold">
                                    {person.name}
                                </h2>

                                <p className="text-[#E5553C] font-semibold mt-2">
                                    {person.role}
                                </p>


                                <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-[#FFF4F0] border border-[#FFE3DF]">
                                    <p className="text-gray-600 mt-2">
                                    {person.position}
                                </p>
                                    <img
                                        src={person.flag}
                                        alt={`${person.country} Flag`}
                                        className="w-5 h-4 rounded-sm object-cover"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        {person.country}
                                    </span>
                                </div>

                                <p className="mt-6 text-gray-700 leading-relaxed">
                                    {person.bio}
                                </p>

                                <a
                                    href={person.linkedin}
                                    target="_blank"
                                    className="inline-flex items-center gap-2 mt-6 text-[#E5553C] font-semibold"
                                >
                                    <Linkedin size={18} />
                                    LinkedIn Profile
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* MEMBERS */}
        <section className="pb-24 bg-[#FFF6F4]">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900">
                        Steering Committee Members
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {members.map((member) => (
                        <div
                            key={member.name}
                            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
                        >
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-80 object-cover"
                            />

                            <div className="p-6">

                                <h3 className="mt-4 text-xl font-bold">
                                    {member.name}
                                </h3>

                                <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-[#FFF4F0] border border-[#FFE3DF]">
                                    <img
                                        src={member.flag}
                                        alt={`${member.country} Flag`}
                                        className="w-5 h-4 rounded-sm object-cover"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        {member.country}
                                    </span>
                                </div>

                                <p className="text-[#E5553C] font-semibold mt-2">
                                    {member.role}
                                </p>

                                <p className="text-gray-600 text-sm mt-2">
                                    {member.position}
                                </p>

                                <p className="mt-4 text-gray-700 text-sm leading-relaxed">
                                    {member.bio}
                                </p>

                                <a
                                    href={member.linkedin}
                                    target="_blank"
                                    className="inline-flex items-center gap-2 mt-5 text-[#E5553C] font-semibold"
                                >
                                    <Linkedin size={16} />
                                    LinkedIn
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>

    </main>

    );
}
