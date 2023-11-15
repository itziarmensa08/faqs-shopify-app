import { json } from "@remix-run/node";
import { useLoaderData, Link, useNavigate } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import {
  EmptyState,
  Layout,
  LegacyCard,
  Page,
  Text,
  Button,
  Divider
} from "@shopify/polaris";
import { useState } from "react";

import { getAllFAQs } from "../models/FAQ.server";

export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);
  const faqs = await getAllFAQs(session.shop);

  return json({
    faqs,
  });
}

const EmptyFAQsState = ({ onAction }) => (
  <EmptyState
    heading="No FAQs published yet."
    action={{
      content: 'Post new FAQ',
      onAction,
    }}
    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
  >
  </EmptyState>
);

const FAQList = ({ faqs }) => {
  const [openAnswers, setOpenAnswers] = useState([]);

  const toggleAnswer = (id) => {
    setOpenAnswers((prevOpenAnswers) => {
      if (prevOpenAnswers.includes(id)) {
        return prevOpenAnswers.filter((faqId) => faqId !== id);
      } else {
        return [...prevOpenAnswers, id];
      }
    });
  };

  return (
    <div>
      {faqs.map((faq) => (
        <div key={faq.id} style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="headingSm" as="h6">{faq.question}</Text>
            <Button plain onClick={() => toggleAnswer(faq.id)}>
              {openAnswers.includes(faq.id) ? "-" : "+"}
            </Button>
          </div>
          {openAnswers.includes(faq.id) && (
            <Text style={{ fontSize: '16px', marginTop: '8px' }}>{faq.answer ?? 'No answer yet'}</Text>
          )}
          <Divider borderColor="border-inverse"/>
          
        </div>
      ))}
    </div>
  );
}

export default function Index() {
  const { faqs } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section variant="oneThird">
          <LegacyCard title="FAQs" sectioned>
            <p>
              Everything you need to know about the page. Can't find the answers
              you are looking for?{" "}
              <Link to="/app/faqs/new">Please click here to send your questions.</Link>
            </p>
          </LegacyCard>
        </Layout.Section>
        <Layout.Section>
          <LegacyCard sectioned>
            {faqs.length === 0 ? (
              <EmptyFAQsState onAction={() => navigate("/app/faqs/new")} />
            ) : (
              <FAQList faqs={faqs} />
            )}
          </LegacyCard>
        </Layout.Section>        
      </Layout>
    </Page>
  );
}