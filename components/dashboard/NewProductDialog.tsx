"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Sparkles } from "lucide-react";

interface NewProductDialogProps {
  storeId: string;
}

export function NewProductDialog({ storeId }: NewProductDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
    stock: "0",
    seoTitle: "",
    seoDescription: "",
  });

  const handleGenerateAI = async () => {
    const title = formData.title.trim();
    const category = formData.category.trim();

    if (!title) {
      alert("Please enter a product title first");
      return;
    }

    try {
      setIsGenerating(true);
      const response = await fetch("/api/ai/generate-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category: category || undefined }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("AI generation error:", errorData);
        
        // Show specific error message
        const errorMessage = errorData.error || "Failed to generate content";
        alert(`AI Generation Error: ${errorMessage}`);
        return;
      }

      const data = await response.json();

      // Fill the form fields with generated content
      setFormData((prev) => ({
        ...prev,
        description: data.description || prev.description,
        seoTitle: data.seoTitle || prev.seoTitle,
        seoDescription: data.seoDescription || prev.seoDescription,
      }));
    } catch (error) {
      console.error("AI generation error:", error);
      alert("An error occurred while generating content");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          ...formData,
          price: Math.round(parseFloat(formData.price) * 100), // Convert to minor units
          stock: parseInt(formData.stock) || 0,
          seoTitle: formData.seoTitle || null,
          seoDescription: formData.seoDescription || null,
        }),
      });

      if (response.ok) {
        setOpen(false);
        router.refresh();
        // Reset form
        setFormData({
          title: "",
          description: "",
          price: "",
          imageUrl: "",
          category: "",
          stock: "0",
          seoTitle: "",
          seoDescription: "",
        });
      } else {
        alert("Failed to create product");
      }
    } catch (error) {
      console.error("Product creation error:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
          <DialogDescription>
            Add a new product to your store. Use AI to generate content automatically.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="e.g., Electronics, Clothing"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Description *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateAI}
                  disabled={isGenerating || !formData.title.trim()}
                  className="text-xs"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  {isGenerating ? "Generating..." : "✨ Generate with AI"}
                </Button>
              </div>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                required
                placeholder="Product description..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₪) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) =>
                  setFormData({ ...formData, seoTitle: e.target.value })
                }
                placeholder="SEO-optimized title (max 60 characters)"
                maxLength={60}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                value={formData.seoDescription}
                onChange={(e) =>
                  setFormData({ ...formData, seoDescription: e.target.value })
                }
                rows={2}
                placeholder="SEO meta description (max 150 characters)"
                maxLength={150}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
