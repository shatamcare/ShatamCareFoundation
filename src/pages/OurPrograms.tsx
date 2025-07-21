
import { Heart, Users, BookOpen, Home, Clock, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const OurPrograms = () => {
  const programs = [
    {
      icon: Heart,
      title: "Caregiver Training Workshops",
      description: "Comprehensive training programs equipping family caregivers with essential skills for dementia care and emotional support techniques.",
      cta: "Join Training"
    },
    {
      icon: Users,
      title: "Memory Care Support Groups",
      description: "Safe spaces for caregivers and families to share experiences, learn from each other, and build lasting support networks.",
      cta: "Find Group"
    },
    {
      icon: BookOpen,
      title: "Educational Resources",
      description: "Evidence-based materials, guides, and toolkits designed to enhance understanding of dementia care and management strategies.",
      cta: "Access Resources"
    },
    {
      icon: Home,
      title: "Home Care Consultation",
      description: "Personalized assessments and recommendations to create safe, comfortable living environments for those with dementia.",
      cta: "Book Consultation"
    },
    {
      icon: Clock,
      title: "Respite Care Services",
      description: "Temporary care support giving primary caregivers essential breaks while ensuring continuous quality care for their loved ones.",
      cta: "Learn More"
    },
    {
      icon: Award,
      title: "Certification Programs",
      description: "Professional certification courses for healthcare workers and volunteers specializing in dementia care and support services.",
      cta: "Get Certified"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-warm-teal text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Programs</h1>
          <p className="text-xl text-warm-teal-100 max-w-2xl mx-auto">
            Comprehensive support programs designed to empower caregivers and enhance quality of life for those living with dementia.
          </p>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-sunrise-orange py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-white text-center">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              <span className="text-lg font-semibold">500+ caregivers trained</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6" />
              <span className="text-lg font-semibold">3,000+ sessions delivered</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6" />
              <span className="text-lg font-semibold">800+ families supported</span>
            </div>
          </div>
        </div>
      </section>

      {/* Program Cards */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-warm-teal/10 rounded-full w-fit">
                    <program.icon className="h-8 w-8 text-warm-teal" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-dark-charcoal">
                    {program.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                    {program.description}
                  </CardDescription>
                  <Button className="bg-warm-teal hover:bg-warm-teal/90 text-white px-6 py-2"
                    aria-label={`Learn more about ${program.title}`}>
                    {program.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-dark-charcoal mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community of trained caregivers and help transform lives in your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-warm-teal hover:bg-warm-teal/90 text-white px-8 py-3">
              Enroll in Training
            </Button>
            <Button size="lg" variant="outline" className="border-warm-teal text-warm-teal hover:bg-warm-teal/5 px-8 py-3">
              Download Brochure
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurPrograms;
