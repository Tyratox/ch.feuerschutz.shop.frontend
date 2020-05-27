import { GetStaticPaths, GetStaticProps } from "next";

const Page = (props) => {
  return <div>hi {JSON.stringify(props)}</div>;
};

export default Page;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { slug: "test" } }],
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  console.log("context", context, "params", context.params);
  return { props: { slug: context.params.slug } };
};
