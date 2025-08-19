import React from 'react';
import TestimonialCard from '../TestimonialCard';
import { images } from '@/assets/images';
const Trust = () => {
  const testimonials = [{
    quote: "Coinomad transformed how we pay our remote team. No more banking headaches or currency conversion fees. Just simple, reliable crypto payroll.",
    name: "Alex Morgan",
    title: "CTO",
    company: "BlockDevs Inc",
    avatar: images.avatar1
  }]

  const partners = [images.partner1, images.partner2, images.partner3, images.partner4, images.partner5, images.partner6];
  return <section className="py-20 bg-black" id="partners">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          
          
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => <TestimonialCard key={index} quote={testimonial.quote} name={testimonial.name} title={testimonial.title} company={testimonial.company} avatar={testimonial.avatar} />)}
        </div>
        
        <div className="pt-12 border-t border-coinomad-border">
          <h3 className="text-center text-lg text-coinomad-textGray mb-8">Our Partners</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {partners.map((partner, index) => <div key={index} className="flex justify-center">
                <img src={partner} alt={`Partner ${index + 1}`} className="h-12 opacity-70 hover:opacity-100 transition-opacity" />
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};
export default Trust;