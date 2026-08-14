import React from 'react';
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from 'react-email';
import { barebonesBoxedTailwindConfig } from './theme';
import { BarebonesFonts } from './theme-fonts';
import Handlebars from 'handlebars';
import dayjs from 'dayjs';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

const textOnlyTitle = 'Изменение пароля';

const templates = [
  Handlebars.compile('{{fullName}},'),
  Handlebars.compile('Ваш пароль был успешно изменён {{changeDate}}!'),
];

interface TextOnlyEmailProps {
  fullName: string;
  changeDate: Date;
}

export const NotifyPasswordChange = ({
  changeDate,
  fullName,
}: TextOnlyEmailProps) => (
  <Tailwind config={barebonesBoxedTailwindConfig}>
    <Html>
      <Head>
        <BarebonesFonts />
      </Head>

      <Body className="bg-bg-2 m-0 text-center font-sans">
        <Preview>Изменение пароля</Preview>
        <Container className="mobile:mt-0 mx-auto mt-8 w-full max-w-[640px]">
          <Section>
            <Section className="bg-bg mobile:px-2 px-6 py-4">
              <Section className="mb-3 px-6">
                <Row>
                  <Column className="w-1/2 py-[7px] align-middle">
                    <Row>
                      <Column className="w-[32px] align-middle">
                        <Img
                          src={`${baseUrl}/static/shared/logo-black.png`}
                          alt=""
                          width={23}
                          className="block"
                        />
                      </Column>
                    </Row>
                  </Column>
                  <Column align="right" className="w-1/2 py-[7px] align-middle">
                    <Text className="font-13 m-0 text-right font-sans">
                      <span className="text-fg-3">Zhe_nU Tools</span>
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Section className="bg-bg-2 mobile:px-6 mobile:py-12 rounded-[8px] px-[40px] py-20 text-left">
                <Section className="mb-8">
                  <Heading
                    as="h1"
                    className="font-28 text-fg m-0 text-left font-sans"
                  >
                    {textOnlyTitle}
                  </Heading>
                </Section>

                {templates.map((t, i) => (
                  <Text
                    key={i}
                    className="font-16 text-fg-2 mt-0 mb-6 max-w-[420px] text-left font-sans last:mb-0"
                  >
                    {t({
                      changeDate: dayjs(changeDate).format('DD.MM.YYYY'),
                      fullName,
                    })}
                  </Text>
                ))}
              </Section>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

NotifyPasswordChange.PreviewProps = {
  changeDate: new Date(),
  fullName: 'Иванов Иван',
} satisfies TextOnlyEmailProps;

export default NotifyPasswordChange;
