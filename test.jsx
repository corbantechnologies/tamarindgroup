"use client";

import { useState } from "react";

import {
  Plus,
  FileText,
  Users,
  CheckCircle,
  XCircle,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import CreateFeedbackForm from "@/forms/feedbackforms/CreateFeedbackForm";
import { useFetchCenter } from "@/hooks/centers/actions";
import { useParams } from "next/navigation";
import Link from "next/link";

function CenterDetail() {
  const { center_identity } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    isLoading: isLoadingCenter,
    data: center,
    refetch: refetchCenter,
  } = useFetchCenter(center_identity);

  if (isLoadingCenter) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  const totalQuestions =
    center?.feedback_forms?.reduce(
      (sum, form) => sum + (form?.questions?.length || 0),
      0
    ) || 0;

  const totalSubmissions =
    center?.feedback_forms?.reduce(
      (sum, form) => sum + (form?.form_submissions?.length || 0),
      0
    ) || 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{center?.name}</h1>
        <p className="text-muted-foreground">{center?.description}</p>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">📍 {center?.location}</span>
          <span className="flex items-center gap-1">📞 {center?.contact}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Forms</p>
                <p className="text-2xl font-bold">
                  {center?.feedback_forms?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Users className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Submissions
                </p>
                <p className="text-2xl font-bold">{totalSubmissions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Settings className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Questions</p>
                <p className="text-2xl font-bold">{totalQuestions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Forms Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Feedback Forms</CardTitle>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Form
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                
                <CreateFeedbackForm
                  refetch={refetchCenter}
                  closeModal={() => setIsModalOpen(false)}
                  center={center}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {center?.feedback_forms?.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Questions</TableHead>
                    <TableHead className="text-center">Submissions</TableHead>
                    <TableHead className="text-center">Accommodation</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {center.feedback_forms.map((feedbackForm) => (
                    <TableRow key={feedbackForm?.reference}>
                      <TableCell className="font-medium">
                        {feedbackForm?.title}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p
                          className="truncate"
                          title={feedbackForm?.description}
                        >
                          {feedbackForm?.description}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">
                          {feedbackForm?.questions?.length || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">
                          {feedbackForm?.form_submissions?.length || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {feedbackForm?.is_accomodation ? (
                          <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400 mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            feedbackForm?.is_published ? "default" : "secondary"
                          }
                        >
                          {feedbackForm?.is_published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button asChild variant="ghost" size="sm">
                          <Link
                            href={`/centers/${center_identity}/${feedbackForm?.form_identity}`}
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Manage
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No feedback forms yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Create your first feedback form to start collecting responses
                from this center.
              </p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Form
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CenterDetail;
