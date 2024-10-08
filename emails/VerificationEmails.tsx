/* eslint-disable @typescript-eslint/no-unused-vars */
//for template of email
import {Html,Head,Preview,Text,Heading,Row,Section,Font} from '@react-email/components'

interface VerificationEmailProps {
    username: string;
    otp: string;
}
export default function VerficationEmail({username, otp}: VerificationEmailProps) {
   return (
    <Html lang="en" dir="ltr">
    <Head>
        <title>Verification Email</title>
        <Preview>your verifcation code {otp}</Preview>
        <Section>
            <Row>Hello, {username}</Row>
            <Row>
                <Text>Thanks for registering. Your otp for verification is {otp}</Text>
            </Row>
            <Row><Text>If you did not request this code please ignore this email</Text></Row>
        </Section>
    </Head>
</Html>
   )
}