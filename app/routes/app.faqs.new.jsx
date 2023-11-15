import { useState } from "react";
import { json, redirect } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
  useNavigate,
} from "@remix-run/react";
import { authenticate } from "../shopify.server";
import {
  Card,
  Layout,
  Page,
  Text,
  TextField,
  BlockStack,
  PageActions,
} from "@shopify/polaris";

import { createFAQ } from "../models/FAQ.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);  

  return json({
    question: "",
    shop: admin.shop,
  });  

}

export async function action({ request, params }) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  const data = Object.fromEntries(await request.formData());
  data.shop = shop;

  await createFAQ({
    question: data.question,
    shop: data.shop,
  });

  return redirect(`/app`);
}

export default function FAQForm() {
  const errors = useActionData()?.errors || {};

  const faq = useLoaderData();
  const [formState, setFormState] = useState(faq);
  const [cleanFormState, setCleanFormState] = useState(faq);
  const isDirty = JSON.stringify(formState) !== JSON.stringify(cleanFormState);

  const nav = useNavigation();
  const isSaving = nav.state === "submitting" && nav.formData?.get("action") === "create";

  const navigate = useNavigate();

  async function handleSave() {
    const data = {
      question: formState.question,
      shop: formState.shop,
    };

    setCleanFormState({ ...formState });
    submit(data, { method: "post" });
  }

  const submit = useSubmit();

  return (
    <Page>
      <ui-title-bar title={"Post new FAQ"}>
        <button variant="breadcrumb" onClick={() => navigate("/app")}>
          FAQs
        </button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            <Card>
              <BlockStack gap="500">
                <Text variant="headingSm" as="h6">
                  Question
                </Text>
                <TextField
                  id="question"
                  label="Question"
                  labelHidden
                  autoComplete="off"
                  value={formState.question}
                  onChange={(question) => setFormState({ ...formState, question })}
                  error={errors.question}
                />
              </BlockStack>
            </Card>
            {/* Puedes agregar lógica aquí para manejar las respuestas si es necesario */}
          </BlockStack>
        </Layout.Section>
        <Layout.Section>
          <PageActions
            primaryAction={{
              content: "Save",
              loading: isSaving,
              disabled: !isDirty || isSaving,
              onAction: handleSave,
            }}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}