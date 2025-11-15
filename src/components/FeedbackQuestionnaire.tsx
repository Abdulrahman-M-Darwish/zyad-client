"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Star } from "lucide-react";

interface FeedbackQuestionnaireProps {
  onSubmit?: (feedback: FeedbackData) => void;
  onSkip?: () => void;
}

export interface FeedbackData {
  improvement: string;
  followUp: string;
  exercisesClarity: string;
  overallRating: number;
  wouldRecommend: string;
  suggestions: string;
}

export const FeedbackQuestionnaire = ({
  onSubmit,
  onSkip,
}: FeedbackQuestionnaireProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData>({
    improvement: "",
    followUp: "",
    exercisesClarity: "",
    overallRating: 0,
    wouldRecommend: "",
    suggestions: "",
  });

  const handleSubmit = () => {
    onSubmit?.(feedback);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
            <h3 className="text-xl font-semibold text-green-900">
              شكراً لك على وقتك!
            </h3>
            <p className="text-center text-muted-foreground">
              رأيك يساعدنا على تحسين جودة الخدمة المقدمة
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          استبيان تقييم الخدمة
        </CardTitle>
        <p className="text-center text-sm text-muted-foreground">
          نود معرفة رأيك لتحسين تجربتك معنا
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base font-medium">
            ١. هل شعرت بتحسن بعد الجلسات؟
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { value: "significant", label: "نعم بشكل كبير" },
              { value: "slight", label: "تحسن بسيط" },
              { value: "none", label: "لم أشعر بتحسن" },
              { value: "worse", label: "ساءت الحالة" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  setFeedback({ ...feedback, improvement: option.value })
                }
                className={`p-3 rounded-lg border-2 transition-all text-sm ${
                  feedback.improvement === option.value
                    ? "border-primary bg-primary/10 font-medium"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-base font-medium">
            ٢. هل تم متابعتك بعد الجلسة بشكل مناسب؟
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "yes", label: "نعم" },
              { value: "somewhat", label: "إلى حد ما" },
              { value: "no", label: "لا" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  setFeedback({ ...feedback, followUp: option.value })
                }
                className={`p-3 rounded-lg border-2 transition-all ${
                  feedback.followUp === option.value
                    ? "border-primary bg-primary/10 font-medium"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-base font-medium">
            ٣. هل كانت التمارين المنزلية (إن وُجدت) واضحة وسهلة التطبيق؟
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "yes", label: "نعم" },
              { value: "somewhat", label: "إلى حد ما" },
              { value: "no", label: "لا" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  setFeedback({ ...feedback, exercisesClarity: option.value })
                }
                className={`p-3 rounded-lg border-2 transition-all ${
                  feedback.exercisesClarity === option.value
                    ? "border-primary bg-primary/10 font-medium"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-base font-medium">
            ٤. ما تقييمك العام للخدمة؟
          </Label>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() =>
                  setFeedback({ ...feedback, overallRating: rating })
                }
                className="transition-all hover:scale-110"
              >
                <Star
                  className={`h-10 w-10 ${
                    rating <= feedback.overallRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {feedback.overallRating > 0 && `${feedback.overallRating} من 5`}
          </p>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-base font-medium">
            ٥. هل ستوصي الآخرين بالعلاج هنا؟
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "yes", label: "نعم" },
              { value: "maybe", label: "ربما" },
              { value: "no", label: "لا" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  setFeedback({ ...feedback, wouldRecommend: option.value })
                }
                className={`p-3 rounded-lg border-2 transition-all ${
                  feedback.wouldRecommend === option.value
                    ? "border-primary bg-primary/10 font-medium"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label htmlFor="suggestions" className="text-base font-medium">
            ٦. هل لديك أي اقتراحات لتحسين الخدمة؟
          </Label>
          <textarea
            id="suggestions"
            value={feedback.suggestions}
            onChange={(e) =>
              setFeedback({ ...feedback, suggestions: e.target.value })
            }
            placeholder="اكتب اقتراحاتك هنا..."
            className="w-full min-h-[100px] p-3 rounded-lg border-2 border-border focus:border-primary focus:outline-none resize-none"
            dir="rtl"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            className="flex-1"
            size="lg"
            disabled={
              !feedback.improvement ||
              !feedback.followUp ||
              !feedback.exercisesClarity ||
              feedback.overallRating === 0 ||
              !feedback.wouldRecommend
            }
          >
            إرسال التقييم
          </Button>
          {onSkip && (
            <Button onClick={onSkip} variant="outline" size="lg">
              تخطي
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
