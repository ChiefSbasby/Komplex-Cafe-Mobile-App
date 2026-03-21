import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import "../css/ContactUs.css";
import NavBar from "../components/NavBar";

import { useNavigate } from "react-router-dom";



const ContactUs = () => {
    
    return (
        <div className="wrapper">

            <NavBar/>

            {/* ── Hero ── */}
            <section className="hero">
                <div className="hero_text">
                <h1 className="hero_title">Komplex Cafe</h1>
                <p className="hero_tagline">"...Where every cup tells a story."</p>
                </div>
            </section>

            {/* Contact Us Header */}
            <section className="contacts">
                <h1 className="contacts_Title">Contact Us</h1>
                <p className="contacts_text">
                    Reach out to us through our contacts below. 
                    We will try and send a reply as soon as we are 
                    available.
                </p>

                {/* List of Contacts */}
                <div className="contacts_email">
                    <h3 className="contacts_email_text">Email</h3>
                    <p className="email_text"><MdOutlineMail /> komplexcafe@gmail.com</p>
                </div>
                
                <div className="contacts_socmed">
                    <h3 className="contacts_socmed_text">Social Media</h3>
                    <p className="socmed_fb_text"><FaFacebook /> Komplex Cafe</p>
                    <p className="socmed_ig_text"><FaInstagram /> @komplex.cafe</p>
                </div>

                <div className="contacts_other">
                    <h3 className="other_text">Komplex Studios</h3>
                    <p className="other_socmed_fb_text"><FaFacebook /> Komplex Studios</p>
                    <p className="other_socmed_ig_text"><FaInstagram /> @komplex.studios</p>
                </div>

            </section>

        </div>
    )

}

export default ContactUs;