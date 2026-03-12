# Overview of Hyperscaler T&Cs for Commercialising Conver
> Comparative analysis of Microsoft Azure, AWS, and Google Cloud LLM API terms for commercialising AI applications

**Author:** [Joe Thornley](https://datacomgroup.atlassian.net/wiki/people/62a65fd8188d08006fe06fc2)
**Date:** 21 November 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40435482672

---

## 🎯 Context

Companies can commercialise apps built on LLM APIs from Microsoft, AWS, and Google, but each cloud imposes specific terms. All three generally allow building and selling applications that call their LLM services (e.g. a ChatGPT-like SaaS), but they forbid "reselling" the raw API service itself or misusing it to create competing AI offerings. This document compares key policies across resale rights, licensing restrictions, pricing models, end-user compliance requirements, revenue sharing, and liability provisions.

---

## 🔍 Problem

Datacom needs to understand the legal and commercial constraints when commercialising Conver—an AI-powered application built on hyperscaler LLM APIs. The core challenge is navigating each provider's restrictions on resale, competitive use, content moderation, and liability while ensuring Conver can be sold as a commercial product without violating terms or exposing the organisation to undue risk.

---

## 📋 Observations

**1. All three providers forbid direct resale of raw API access**
Microsoft's Azure Online Services terms expressly state: "You may not … resell, transfer, or host the Product, or any portion thereof, to or for third parties" except as permitted. AWS Customer Agreement explicitly prohibits reselling or sublicensing "the Services or AWS Content" to others. Google Cloud terms similarly prohibit reselling GCP services to unauthorised third parties. In practice, Conver must embed LLMs in its own app—charging users for app functionality is allowed, but exposing the API as a paid service is not.

**2. Microsoft Azure token pricing: GPT-4 at $0.03/$0.06 per 1K tokens**
Azure OpenAI is pay-as-you-go billed by token usage. GPT-4 (8k context) is approximately **$0.03 per 1K tokens for input and $0.06 per 1K for output** (matching OpenAI's own pricing). GPT-3.5-Turbo is fractions of a cent per 1K tokens. There are no per-seat license fees—purely consumption-based. Larger customers can negotiate volume-based pricing or dedicated capacity (fixed monthly rate for guaranteed throughput).

**3. AWS Bedrock third-party model pricing example**
Bedrock is billed per-use (token basis). Example rates: **$0.0015 per 1K input tokens and $0.0020 per 1K output tokens** for one third-party model; smaller models may be **$0.0003/$0.0006 per 1K tokens**. Bedrock offers optional Provisioned Throughput for fixed-rate reserved capacity. No revenue sharing—AWS charges for usage only.

**4. Google Vertex AI pricing: PaLM at ~$0.00003/$0.00009 per 1K characters**
Vertex AI uses consumption-based billing. PaLM text API is approximately **$0.00003 per 1,000 characters input and $0.00009 per 1,000 characters output** (roughly $0.03 per million chars in, $0.09 per million out). High-end models (e.g. Gemini) may have higher prices. No fixed license fee for most—pay-for-what-you-use. Google Workspace AI (e.g. Duet AI) is separate at ~$30/user/month.

**5. Microsoft requires explicit AI-generated content disclosure**
Microsoft's Enterprise AI Services Code of Conduct **requires you to disclose to users when content or responses are AI-generated**. Applications must clearly inform end-users they are interacting with AI-generated content. Strong technical controls on inputs and outputs are required for content moderation. AWS and Google have similar expectations (provenance/watermarking) but Microsoft's requirement is most explicit in contract terms.

**6. All three offer IP indemnity with conditions**
Microsoft provides a "Customer Copyright Commitment"—Microsoft will defend and indemnify against third-party copyright/IP claims arising from model output **provided you comply with product terms and usage guidelines** and do not disable content filters. AWS offers **uncapped** IP indemnity for Amazon-developed models (Nova, Titan)—but not for third-party models on Bedrock. Google indemnifies for IP claims on unmodified output and for claims about Google's own training data—**provided you do not disable safety features**. Tampering with filters voids indemnity across all three.

**7. No revenue sharing required by any provider**
Microsoft, AWS, and Google all monetise via usage fees—none require sharing application revenue. You pay for API consumption; customer revenue from your app is yours. The only "cut" is standard cloud consumption fees. Third-party models via Azure Foundry or AWS Bedrock are billed through the platform; model providers get a share of usage fees, but you do not share your app's customer revenue.

**8. High-risk use cases carry indemnity obligations**
Microsoft explicitly bars using Azure OpenAI in critical scenarios where failures could lead to death or serious injury (medical devices, life support, nuclear facilities). If used in high-risk scenarios, you must **indemnify and hold Microsoft harmless**. Google forbids using generative AI for medical/clinical purposes or targeting children under 18. AWS cautions against medical diagnosis or emergency services without proper human oversight.

---

## 💡 Proposal

Use this comparative analysis to inform Conver's commercialisation strategy and compliance posture.

- **Embed LLMs in Conver's application**—do not expose raw API access; charge for Conver's functionality
- **Implement mandatory AI disclosure**—clearly inform users when content is AI-generated (required by Microsoft; best practice for all)
- **Maintain content moderation and safety controls**—required to retain IP indemnity and comply with acceptable use
- **Price Conver to cover token costs**—track usage per customer; ensure pricing covers API consumption
- **Avoid high-risk use cases** without explicit safeguards and human oversight

*Conver can be commercialised as a SaaS application on all three hyperscalers, provided it operates as a value-added application rather than a reseller of raw API access, and maintains compliance with each provider's responsible AI and content moderation requirements.*

---

## ⚠️ Risks

- **Indemnity voided by non-compliance:** Disabling content filters, tampering with safety systems, or breaching terms can void IP indemnity across all providers—exposing Datacom to copyright/IP claims.
- **Competitive use restriction:** All three forbid using outputs to develop competing AI models or services. Using Conver outputs to train or improve competing models would violate terms and risk suspension.
- **Third-party model indemnity gaps:** AWS does not extend indemnity to third-party models on Bedrock (e.g. Anthropic Claude, AI21). Using those models carries higher IP risk than Amazon's own models.
- **High-risk scenario liability:** Use in medical, safety-critical, or child-directed contexts may be prohibited or require full indemnification of the provider—creating significant liability exposure.

---

## ✅ Next Steps

1. **Legal review** — Validate Conver's intended use cases against each provider's terms; confirm no competitive-use or high-risk violations.
2. **Compliance implementation** — Implement AI disclosure, content moderation, and user feedback channels per Microsoft's Code of Conduct and equivalent best practices for AWS/Google.
3. **FinOps and pricing** — Establish token usage tracking per customer; ensure Conver pricing covers API costs across all supported models.
4. **Provider selection** — If IP indemnity is critical, prefer Microsoft (Customer Copyright Commitment) or AWS Amazon models (uncapped indemnity) over third-party Bedrock models.

---

## 🔑 Close

> You can commercialise your AI-powered app on Azure, AWS, or Google—but you cannot resell the raw API, must disclose AI-generated content, and must maintain safety controls to retain indemnity.

All three hyperscalers allow building and selling applications like Conver that call their LLM services. The key constraints are: no resale of raw API access, no competitive use of outputs, mandatory responsible AI practices (especially disclosure and content moderation), and strict adherence to terms to retain IP indemnity. Conver's commercialisation path is viable provided these guardrails are respected.
