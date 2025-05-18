import { MainLayout } from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Recycle, Heart, ShieldCheck, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-primary-light/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold font-heading tracking-tight text-neutral-darkest sm:text-5xl md:text-6xl">
              About <span className="text-primary">EcoFinds</span>
            </h1>
            <p className="mt-6 text-xl text-neutral-dark">
              A sustainable marketplace where you can buy and sell pre-loved items, 
              reducing waste and promoting a circular economy.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-heading text-neutral-darkest mb-8">Our Mission</h2>
            <p className="text-lg text-neutral-dark leading-relaxed">
              At EcoFinds, we're on a mission to transform the way people think about 
              second-hand shopping. We believe that pre-loved items have stories to tell 
              and value to offer. By connecting buyers and sellers in a trusted community, 
              we're extending the lifecycle of products and reducing the environmental impact 
              of consumerism.
            </p>
            <div className="mt-10">
              <Button size="lg">Join Our Community</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-neutral-lightest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold font-heading text-neutral-darkest text-center mb-12">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Leaf className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Sustainability</h3>
                <p className="text-neutral-dark text-center">
                  We're committed to reducing waste and promoting reuse through our marketplace.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Recycle className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Circular Economy</h3>
                <p className="text-neutral-dark text-center">
                  We believe in keeping products in use for as long as possible before recycling.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Community</h3>
                <p className="text-neutral-dark text-center">
                  We foster a community of like-minded individuals passionate about sustainable living.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold font-heading text-neutral-darkest">Meet Our Team</h2>
            <p className="mt-4 text-lg text-neutral-dark">
              We're a passionate team of environmentalists, developers, and design thinkers 
              committed to making sustainable shopping easy and accessible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {['Sarah Green', 'Mark Rivers', 'Leila Park', 'Jay Chen'].map((name, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary-dark" />
                </div>
                <h3 className="text-lg font-medium">{name}</h3>
                <p className="text-neutral-dark">
                  {['Co-Founder', 'CTO', 'Design Lead', 'Community Manager'][index]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-16 bg-neutral-lightest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-3xl font-bold font-heading text-neutral-darkest mb-6">Trust & Safety</h2>
              <p className="text-lg text-neutral-dark mb-6">
                At EcoFinds, your safety is our priority. We've implemented robust 
                verification processes and secure transaction methods to ensure a 
                safe and trusted marketplace for all.
              </p>
              <ul className="space-y-3">
                {[
                  'Verified user profiles',
                  'Secure messaging system',
                  'Product authenticity checks',
                  'Community ratings and reviews',
                ].map((item, i) => (
                  <li key={i} className="flex items-center">
                    <ShieldCheck className="h-5 w-5 text-primary mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 md:pl-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">Our Pledge</h3>
                <p className="text-neutral-dark mb-6">
                  "We're committed to maintaining a marketplace where buyers can shop with 
                  confidence and sellers can list with ease, knowing they're part of a 
                  trusted community."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-primary-dark" />
                  </div>
                  <div>
                    <p className="font-medium">EcoFinds Team</p>
                    <p className="text-sm text-neutral-dark">Safety & Trust Department</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Call to Action */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold font-heading mb-6">Join the EcoFinds Community</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Start your sustainable shopping journey today. Join thousands of environmentally 
            conscious buyers and sellers making a difference.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="secondary" size="lg">Browse Products</Button>
            <Button variant="outline" className="text-white border-white hover:bg-white/10" size="lg">
              List an Item
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}