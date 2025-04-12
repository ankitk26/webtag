import {
  Bookmark,
  FolderOpen,
  Globe,
  Search,
  Share2,
  Tags,
} from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

export default function Features() {
  const features = [
    {
      icon: <Bookmark className="h-12 w-12 text-muted-foreground" />,
      title: "Save Bookmarks",
      description:
        "Quickly save any webpage with a single click and access it from anywhere.",
    },
    {
      icon: <FolderOpen className="h-12 w-12 text-muted-foreground" />,
      title: "Organize Folders",
      description:
        "Create custom folders to organize your bookmarks by project, topic, or category.",
    },
    {
      icon: <Tags className="h-12 w-12 text-muted-foreground" />,
      title: "Tag System",
      description:
        "Add tags to your bookmarks for easier filtering and better organization.",
    },
    {
      icon: <Search className="h-12 w-12 text-muted-foreground" />,
      title: "Powerful Search",
      description:
        "Find any bookmark instantly with our fast and efficient search functionality.",
    },
    {
      icon: <Share2 className="h-12 w-12 text-muted-foreground" />,
      title: "Share Collections",
      description:
        "Share your bookmark collections with friends or colleagues with ease.",
    },
    {
      icon: <Globe className="h-12 w-12 text-muted-foreground" />,
      title: "Cross-platform Access",
      description:
        "Access your bookmarks from any device or browser, anytime and anywhere.",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Powerful tools for your digital discoveries
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Webtag comes packed with all the features you need to effectively
            manage and organize your growing collection of online resources.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
