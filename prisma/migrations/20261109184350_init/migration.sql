-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "public"."LeadStatus" AS ENUM ('DISCOVERED', 'ANALYZED', 'CONTACTED', 'RESPONDED', 'MEETING', 'PROPOSAL', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "public"."Confidence" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "public"."EvidenceKind" AS ENUM ('WEBSITE', 'SOCIAL_PROFILE', 'BUSINESS_PROFILE', 'CATALOG', 'MANUAL_NOTE');

-- CreateEnum
CREATE TYPE "public"."ActivityType" AS ENUM ('NOTE', 'STATUS_CHANGED', 'OUTREACH_APPROVED', 'OUTREACH_SENT', 'REPLY', 'MEETING', 'PROPOSAL', 'FOLLOW_UP', 'DO_NOT_CONTACT');

-- CreateEnum
CREATE TYPE "public"."OutreachStatus" AS ENUM ('DRAFT', 'APPROVED', 'SENT', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."OpportunityStage" AS ENUM ('QUALIFIED', 'MEETING', 'PROPOSAL', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "public"."SearchJobStatus" AS ENUM ('QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Lead" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdById" TEXT,
    "name" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "segment" TEXT,
    "city" TEXT,
    "region" TEXT,
    "phone" TEXT,
    "websiteUrl" TEXT,
    "mapsUrl" TEXT,
    "status" "public"."LeadStatus" NOT NULL DEFAULT 'DISCOVERED',
    "score" INTEGER NOT NULL DEFAULT 0,
    "scoreBreakdown" JSONB,
    "doNotContact" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExternalPlaceReference" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'google_places',
    "externalId" TEXT NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "retentionUntil" TIMESTAMP(3),
    "sourceUrl" TEXT,

    CONSTRAINT "ExternalPlaceReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LeadEvidence" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "kind" "public"."EvidenceKind" NOT NULL,
    "statement" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "observedAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "confidence" "public"."Confidence" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LeadAnalysis" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "observedFacts" JSONB NOT NULL,
    "commercialHypotheses" JSONB NOT NULL,
    "recommendedService" TEXT,
    "score" INTEGER NOT NULL,
    "scoreBreakdown" JSONB NOT NULL,
    "modelProvider" TEXT,
    "modelVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OutreachDraft" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "public"."OutreachStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "generatedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutreachDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Activity" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "actorId" TEXT,
    "type" "public"."ActivityType" NOT NULL,
    "body" TEXT,
    "metadata" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Opportunity" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "recommendedService" TEXT,
    "estimatedValue" DECIMAL(12,2),
    "probability" INTEGER,
    "stage" "public"."OpportunityStage" NOT NULL DEFAULT 'QUALIFIED',
    "nextStepAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SearchJob" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT,
    "limit" INTEGER NOT NULL,
    "status" "public"."SearchJobStatus" NOT NULL DEFAULT 'QUEUED',
    "provider" TEXT NOT NULL DEFAULT 'google_places',
    "requestCount" INTEGER NOT NULL DEFAULT 0,
    "estimatedCost" DECIMAL(10,4),
    "error" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SearchJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "Lead_organizationId_status_idx" ON "public"."Lead"("organizationId", "status");

-- CreateIndex
CREATE INDEX "Lead_organizationId_score_idx" ON "public"."Lead"("organizationId", "score");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_organizationId_normalizedName_city_key" ON "public"."Lead"("organizationId", "normalizedName", "city");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalPlaceReference_leadId_key" ON "public"."ExternalPlaceReference"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalPlaceReference_provider_externalId_key" ON "public"."ExternalPlaceReference"("provider", "externalId");

-- CreateIndex
CREATE INDEX "LeadEvidence_leadId_verifiedAt_idx" ON "public"."LeadEvidence"("leadId", "verifiedAt");

-- CreateIndex
CREATE INDEX "LeadAnalysis_leadId_createdAt_idx" ON "public"."LeadAnalysis"("leadId", "createdAt");

-- CreateIndex
CREATE INDEX "OutreachDraft_leadId_status_idx" ON "public"."OutreachDraft"("leadId", "status");

-- CreateIndex
CREATE INDEX "Activity_leadId_occurredAt_idx" ON "public"."Activity"("leadId", "occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "Opportunity_leadId_key" ON "public"."Opportunity"("leadId");

-- CreateIndex
CREATE INDEX "SearchJob_organizationId_status_createdAt_idx" ON "public"."SearchJob"("organizationId", "status", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lead" ADD CONSTRAINT "Lead_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lead" ADD CONSTRAINT "Lead_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExternalPlaceReference" ADD CONSTRAINT "ExternalPlaceReference_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeadEvidence" ADD CONSTRAINT "LeadEvidence_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LeadAnalysis" ADD CONSTRAINT "LeadAnalysis_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OutreachDraft" ADD CONSTRAINT "OutreachDraft_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Activity" ADD CONSTRAINT "Activity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Activity" ADD CONSTRAINT "Activity_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Opportunity" ADD CONSTRAINT "Opportunity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SearchJob" ADD CONSTRAINT "SearchJob_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
