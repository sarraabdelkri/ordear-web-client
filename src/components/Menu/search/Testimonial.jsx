import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiFillStar } from "react-icons/ai";
import SubHeading from "../../Menu/SubHeading";
import ProfilePic from "../../../assets/john-doe-image.png"; // Assuming you want a default image if none is provided

const Testimonial = () => {
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/avis/getAllAvis`)
             .then(response => {
                 setTestimonials(response.data);
             })
             .catch(error => {
                 console.error('Error fetching testimonials:', error);
             });
    }, []);

    return (
        <div className="work-section-wrapper" style={{ marginTop: "10px" }}>
            <SubHeading title="Testimonials" />
            <h1>What They Are Saying</h1>
            {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial">
                    <img src={testimonial.user.images || ProfilePic} alt={testimonial.user.name} />
                    <p>{testimonial.comment}</p>
                    <div className="testimonial-stars">
                        {[...Array(testimonial.note)].map((_, i) => <AiFillStar key={i} />)}
                    </div>
                    <h2>{testimonial.user.name}</h2>
                </div>
            ))}
        </div>
    );
};

export default Testimonial;
