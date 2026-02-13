--
-- PostgreSQL database dump
--

\restrict kDexVKoebwY7lxslZHqdjIRspenDWtybFN6GDIsEjvXoL2rYwmgrpvfGTiMZN5Z

-- Dumped from database version 16.11 (Debian 16.11-1.pgdg13+1)
-- Dumped by pg_dump version 16.11 (Debian 16.11-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: brands; Type: TABLE; Schema: public; Owner: electro_user
--

CREATE TABLE public.brands (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    "logoUrl" character varying(500) NOT NULL,
    "inventorName" character varying NOT NULL,
    "inventorImageUrl" character varying(500),
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.brands OWNER TO electro_user;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: electro_user
--

CREATE TABLE public.categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "iconKey" character varying
);


ALTER TABLE public.categories OWNER TO electro_user;

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: electro_user
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO electro_user;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: electro_user
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO electro_user;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: electro_user
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: electro_user
--

CREATE TABLE public.order_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    quantity integer NOT NULL,
    "priceAtTime" numeric(10,2) NOT NULL,
    "orderId" uuid,
    "productId" uuid
);


ALTER TABLE public.order_items OWNER TO electro_user;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: electro_user
--

CREATE TABLE public.orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "totalAmount" numeric NOT NULL,
    status character varying DEFAULT 'PENDING'::character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" uuid,
    "stripeSessionId" character varying,
    "stripePaymentIntentId" character varying,
    "shippingAmount" numeric DEFAULT '0'::numeric NOT NULL
);


ALTER TABLE public.orders OWNER TO electro_user;

--
-- Name: products; Type: TABLE; Schema: public; Owner: electro_user
--

CREATE TABLE public.products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "categoryId" uuid,
    name character varying NOT NULL,
    description character varying,
    price numeric(10,2) NOT NULL,
    "imageUrl" character varying(500),
    stock integer DEFAULT 0 NOT NULL,
    rating numeric(3,2) DEFAULT '0'::numeric NOT NULL,
    "discountPercent" integer DEFAULT 0 NOT NULL,
    specs json,
    "brandId" uuid,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "productCode" integer NOT NULL
);


ALTER TABLE public.products OWNER TO electro_user;

--
-- Name: products_productCode_seq; Type: SEQUENCE; Schema: public; Owner: electro_user
--

CREATE SEQUENCE public."products_productCode_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."products_productCode_seq" OWNER TO electro_user;

--
-- Name: products_productCode_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: electro_user
--

ALTER SEQUENCE public."products_productCode_seq" OWNED BY public.products."productCode";


--
-- Name: subscribers; Type: TABLE; Schema: public; Owner: electro_user
--

CREATE TABLE public.subscribers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.subscribers OWNER TO electro_user;

--
-- Name: users; Type: TABLE; Schema: public; Owner: electro_user
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    role character varying DEFAULT 'USER'::character varying NOT NULL,
    "firstName" character varying,
    "lastName" character varying,
    phone character varying,
    gender character varying,
    "dateOfBirth" date,
    avatar character varying,
    "addressStreet" character varying,
    "addressCity" character varying,
    "addressState" character varying,
    "addressPostCode" character varying,
    "addressCountry" character varying
);


ALTER TABLE public.users OWNER TO electro_user;

--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: electro_user
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: products productCode; Type: DEFAULT; Schema: public; Owner: electro_user
--

ALTER TABLE ONLY public.products ALTER COLUMN "productCode" SET DEFAULT nextval('public."products_productCode_seq"'::regclass);


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: electro_user
--

COPY public.brands (id, name, "logoUrl", "inventorName", "inventorImageUrl", "createdAt", "updatedAt") FROM stdin;
3f8c5eaf-7261-41a8-aa94-d8fd5da5924e	Apple	/uploads/brands/1768536351346-326329274-747.png	Steve Jobs	/uploads/brands/1768536351347-311163142-Jobs_hero20110329.webp	2026-01-16 04:05:51.362086	2026-01-16 04:05:51.362086
fe946063-95af-44ae-8123-e8d8f3428506	Samsung	/uploads/brands/1768536455737-550324269-PngItem_24638.png	Lee Byung-chul	/uploads/brands/1768536455738-376894073-img_hoam_lee_02.jpg	2026-01-16 04:07:35.758132	2026-01-16 04:07:35.758132
2c7bac72-b2e5-4e6b-b790-b9ec74368fd1	Lenovo	/uploads/brands/1770728943116-451832653-Branding_lenovo-logo_lenovologoposred_low_res.png	Liu Chuanzhi	/uploads/brands/1770728943117-341261140-images.webp	2026-02-10 13:09:03.129399	2026-02-10 13:09:03.129399
de8cb041-2558-49aa-8092-20e56d5571f7	ROG	/uploads/brands/1770903901183-348823933-ROG logo_red.png	Jonney Shih	/uploads/brands/1770903901189-109781302-images.webp	2026-02-12 13:45:01.198283	2026-02-12 13:45:01.198283
e5280e23-b445-4c2d-9372-0accb88c5d44	Razer	/uploads/brands/1770951004873-691221864-razer-ths-logo.svg	Min-Liang Tan	/uploads/brands/1770950715392-77957225-2026-02-13 09.45.00.jpg	2026-02-13 02:45:15.401387	2026-02-13 02:50:04.880699
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: electro_user
--

COPY public.categories (id, name, "createdAt", "updatedAt", "iconKey") FROM stdin;
f4621d53-a2ff-4edb-8564-c2500193769f	Smartwatch	2026-01-04 04:04:03.316683	2026-02-10 13:54:33.657541	\N
d1a01f1a-bc62-4692-9e3c-26543eb1b663	Tablets	2026-01-04 03:58:56.541681	2026-02-10 13:54:41.204194	\N
31faf6d3-ab50-4de3-8d74-8ee1763ea2af	Laptops	2026-01-03 13:55:46.382367	2026-02-10 13:54:52.705764	\N
8282eaa0-5db9-4eda-a418-bfb70d3210da	Accessories	2025-12-29 14:50:42.035801	2026-02-10 13:54:56.970695	\N
f57a59a2-0499-419f-96b0-88d3efdc483f	Smartphones	2025-12-29 05:27:10.963619	2026-02-10 13:54:59.096881	\N
635afd2d-1c19-49c8-94c9-07e1cd20eee1	Wifi	2026-02-12 13:48:39.178785	2026-02-12 13:48:39.178785	wifi
e34d553e-8bf8-49ce-a92b-0fb16d22022e	TV	2026-02-13 02:29:56.674186	2026-02-13 02:29:56.674186	tv
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: electro_user
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
1	1739260800000	AddProductCode1739260800000
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: electro_user
--

COPY public.order_items (id, quantity, "priceAtTime", "orderId", "productId") FROM stdin;
93006559-6610-4794-936f-f90a4ab9427d	2	1200.00	7283f65c-7b77-4097-aba4-1433988953c4	43461d08-c870-4b24-b675-b1e56f29eaab
7334ad4e-d6fb-470a-9ef0-f05e7b4872ae	4	1200.00	af97813f-f298-4a10-bf83-1e34d771d5d3	43461d08-c870-4b24-b675-b1e56f29eaab
d27aa415-0f36-4bac-8a87-9c2025eb85b1	3	1200.00	\N	43461d08-c870-4b24-b675-b1e56f29eaab
0dae9d7b-0a6f-4df3-b64e-499398a6d6e2	1	3499.00	3f9bf929-70ac-4a78-991a-98c13942f6c8	78f63f4e-d431-4c71-bf4f-6fbd13acf624
50b0eec4-bb3c-44e4-a916-c4d590161ac5	1	3499.00	2379cf19-b31e-4cbd-a5a7-a6b8adb9c826	78f63f4e-d431-4c71-bf4f-6fbd13acf624
8031e3c0-1ea7-4d01-a7bd-8b1453c6f1f3	1	3499.00	691fbaec-6a06-4ee0-b2f5-91cbf7db4583	b60be1ce-4189-4619-a301-d6d096c6b33d
c639e4b7-470f-4275-9c4a-7a70fd77cb81	1	3499.00	fceed0ef-705f-4445-a411-de6fed787bbd	b60be1ce-4189-4619-a301-d6d096c6b33d
2b40b52a-df19-4674-b8ff-7e9eb81370e1	1	3499.00	fb1a40c0-843a-4308-afc2-241db4569c94	78f63f4e-d431-4c71-bf4f-6fbd13acf624
a7beb9bb-d021-4e73-97b2-e897e2b9a4e4	1	3499.00	3e24ef0d-82fe-4bdb-94d3-99bbe58d0754	78f63f4e-d431-4c71-bf4f-6fbd13acf624
37db68c1-ebf8-4708-a329-48a5e1bc5fe1	1	3499.00	1704897b-e4fe-43ed-991f-82f1181cf34e	78f63f4e-d431-4c71-bf4f-6fbd13acf624
eff6093f-f2dd-4e98-8c41-26960caed1bd	1	3499.00	522bf6b5-b8f4-4b4e-a172-957e05b0c288	78f63f4e-d431-4c71-bf4f-6fbd13acf624
d3e6fc7d-85ac-44d8-abf7-6d8f8e9bb113	1	3499.00	aad62278-f98e-41b2-a7be-8fae3ccbb6f6	78f63f4e-d431-4c71-bf4f-6fbd13acf624
cbece4f7-2cfa-4008-b720-1ec8b460a5a6	1	3499.00	b358031e-b87c-430c-8aa3-c5ed3115ca6c	78f63f4e-d431-4c71-bf4f-6fbd13acf624
c1c70e3d-4ab3-4c91-a395-1d52cbaa9f69	1	3499.00	cd298da3-1d80-4805-91f1-0a4750a52cc1	78f63f4e-d431-4c71-bf4f-6fbd13acf624
7f3d7c9c-ee80-453a-8554-693ad06e0f43	1	3499.00	7e898098-ffde-4fc9-8bd4-6ea845c98ca7	78f63f4e-d431-4c71-bf4f-6fbd13acf624
91a05770-d549-4240-bc94-faa374b776b9	1	3499.00	d575ed66-95e8-41ca-9817-e8eab0c2ef57	78f63f4e-d431-4c71-bf4f-6fbd13acf624
db59f971-f917-486b-9b06-212697f04b9e	1	3499.00	b4a16179-0ea6-4cff-acce-f911db2af147	78f63f4e-d431-4c71-bf4f-6fbd13acf624
720b9dc3-218a-471f-ac9c-2b39e044f689	1	3499.00	d7869791-384c-4612-a3e8-4b4c8772dd61	78f63f4e-d431-4c71-bf4f-6fbd13acf624
b5eccfbb-efd0-4ac0-9f67-99f735b9ed89	1	3499.00	881cc31d-6195-4b3d-a2d7-9e78b223908e	78f63f4e-d431-4c71-bf4f-6fbd13acf624
1deb8ea3-f1a7-408a-b0e7-158f88d86300	1	3499.00	c2e65d95-fa62-4b7f-a1a6-a0ff41efe268	78f63f4e-d431-4c71-bf4f-6fbd13acf624
3fcb16d1-f338-43dd-bf0e-e8aaad612db2	1	3499.00	ee351124-5e95-493c-b912-2d10e065757e	78f63f4e-d431-4c71-bf4f-6fbd13acf624
ec1073ec-8175-4fc8-9ae8-5bbc80a35df0	1	3499.00	638b0775-f7d3-4019-8ffd-ee9772627127	78f63f4e-d431-4c71-bf4f-6fbd13acf624
2f88e93d-238a-4cce-a2d3-aacb53cb9bf7	1	3499.00	7c58ae82-6f8f-4e33-b327-d67905d8447b	78f63f4e-d431-4c71-bf4f-6fbd13acf624
4dc4f37a-50e4-4188-bea0-ad78285cf616	1	3499.00	6ae130f6-ba89-43ae-adf0-d072b9028885	78f63f4e-d431-4c71-bf4f-6fbd13acf624
205d508c-3760-40ed-b77e-fe6905c46821	1	3499.00	2ffc5ec1-5c53-4ab9-83dd-39aac5ed8197	78f63f4e-d431-4c71-bf4f-6fbd13acf624
413bfe08-2b4f-4c36-987e-8906b5c51abd	1	3499.00	c0ff6c0a-7727-40ec-87c0-4d352af1b194	78f63f4e-d431-4c71-bf4f-6fbd13acf624
7779832f-ea75-4836-a536-e2905c4e7fba	1	3499.00	c61fde84-da58-408c-96ac-21ff9d072eb5	78f63f4e-d431-4c71-bf4f-6fbd13acf624
a21fe4d9-490e-4673-93e0-25ee6da03c3d	1	3499.00	6798e561-b439-45b2-916c-86a4a44da892	78f63f4e-d431-4c71-bf4f-6fbd13acf624
c3a46de2-bdd8-4317-b499-5279cb27967e	1	3499.00	8917dc24-ed6e-40ec-b0da-7062ceb7b4ea	78f63f4e-d431-4c71-bf4f-6fbd13acf624
e2ef0954-c0cc-4f69-9457-77b97733ae7b	1	3499.00	53afb840-f94e-4d6f-ad65-fb5b8c8b5bf3	78f63f4e-d431-4c71-bf4f-6fbd13acf624
316e13a3-969c-4e30-80a4-691e9cc462e6	1	3499.00	1002b0aa-dbb5-4474-8a7c-55a6be539606	78f63f4e-d431-4c71-bf4f-6fbd13acf624
a1841b2f-9526-4d87-b3a1-fb11e54b5d9c	1	3499.00	8eb6ce3f-c9ef-4b19-8160-2d1313902817	b60be1ce-4189-4619-a301-d6d096c6b33d
18446a76-8647-4a45-ba86-081e1a76b7ef	1	3499.00	e58f436a-2566-4645-b1f4-1fc898a77912	b60be1ce-4189-4619-a301-d6d096c6b33d
5c134c67-d0f4-438f-9606-14814d71a94d	1	3499.00	306bad5e-828b-4984-852a-c37f3c2f1a90	b60be1ce-4189-4619-a301-d6d096c6b33d
505bd94f-f590-44ef-aec1-32bb22ca1060	1	3499.00	6fa6a7c5-7e11-4e1f-bc0b-168045066a1f	78f63f4e-d431-4c71-bf4f-6fbd13acf624
d7ea9d60-d633-4ddd-a4c3-6fbc44566e43	1	3499.00	aa2fe80f-5074-4efd-a62d-6ead4b7b38a5	b60be1ce-4189-4619-a301-d6d096c6b33d
5fb56bad-1e8f-4d58-ad95-bb221aa21f2e	1	1899.00	66514eb2-8787-4093-851d-2a1ce3ad97db	684afcd6-ef92-40f3-b309-efb1ff78f181
6e6e53cf-61e5-48f2-9d88-83ade27598d1	2	1899.00	5b01a3ed-49a2-471b-87b7-ee1b3f1f082c	684afcd6-ef92-40f3-b309-efb1ff78f181
59f079a3-bcf6-488a-bdac-db4fa782f96c	1	1899.00	a6a83909-1564-4e81-a8e9-b0f1d70b9d02	684afcd6-ef92-40f3-b309-efb1ff78f181
103a7b8b-23f1-4732-9210-c8f9fd3ae924	1	3499.00	a6a83909-1564-4e81-a8e9-b0f1d70b9d02	78f63f4e-d431-4c71-bf4f-6fbd13acf624
c482f8aa-8a8d-40ea-9fd2-80e769a2f443	1	1899.00	05807422-efe5-40d5-8055-1ebc155c9f9a	684afcd6-ef92-40f3-b309-efb1ff78f181
5a5385e2-a00b-4459-a510-f6833defe4a2	1	1199.00	9f158be2-7c0f-436a-8640-6dc61c0bb002	43461d08-c870-4b24-b675-b1e56f29eaab
a01fb717-9d92-48f6-9564-6a5c094fa072	1	3499.00	6b1adb66-6115-4645-9ec0-15385a8fb9a7	b60be1ce-4189-4619-a301-d6d096c6b33d
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: electro_user
--

COPY public.orders (id, "totalAmount", status, "createdAt", "userId", "stripeSessionId", "stripePaymentIntentId", "shippingAmount") FROM stdin;
af97813f-f298-4a10-bf83-1e34d771d5d3	4800	PENDING	2025-12-27 16:30:46.33641	3e13fd21-f689-45c7-9e66-7b353e5ddbb8	\N	\N	0
7283f65c-7b77-4097-aba4-1433988953c4	2400	PAID	2025-12-27 12:52:59.133023	3e13fd21-f689-45c7-9e66-7b353e5ddbb8	\N	\N	0
3f9bf929-70ac-4a78-991a-98c13942f6c8	3499	PENDING	2026-02-05 04:42:23.877605	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
2379cf19-b31e-4cbd-a5a7-a6b8adb9c826	3499	PENDING	2026-02-05 04:44:49.709045	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
691fbaec-6a06-4ee0-b2f5-91cbf7db4583	3499	CANCELLED	2026-02-06 01:31:58.46107	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
fceed0ef-705f-4445-a411-de6fed787bbd	3499	CANCELLED	2026-02-06 01:45:40.614021	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
7c58ae82-6f8f-4e33-b327-d67905d8447b	3499	CANCELLED	2026-02-06 09:05:25.829875	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
fb1a40c0-843a-4308-afc2-241db4569c94	3499	CANCELLED	2026-02-06 04:01:52.64086	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
6ae130f6-ba89-43ae-adf0-d072b9028885	3499	CANCELLED	2026-02-06 09:08:10.656298	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
3e24ef0d-82fe-4bdb-94d3-99bbe58d0754	3499	CANCELLED	2026-02-06 04:09:32.611107	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
1704897b-e4fe-43ed-991f-82f1181cf34e	3499	CANCELLED	2026-02-06 04:30:12.103731	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
2ffc5ec1-5c53-4ab9-83dd-39aac5ed8197	3499	CANCELLED	2026-02-06 09:10:27.006132	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
522bf6b5-b8f4-4b4e-a172-957e05b0c288	3499	CANCELLED	2026-02-06 04:32:35.748536	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
aad62278-f98e-41b2-a7be-8fae3ccbb6f6	3499	CANCELLED	2026-02-06 04:34:52.879686	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
c0ff6c0a-7727-40ec-87c0-4d352af1b194	3499	CANCELLED	2026-02-06 09:11:06.752845	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
b358031e-b87c-430c-8aa3-c5ed3115ca6c	3499	CANCELLED	2026-02-06 04:37:27.488908	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
306bad5e-828b-4984-852a-c37f3c2f1a90	3499	CANCELLED	2026-02-09 10:40:52.037512	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
cd298da3-1d80-4805-91f1-0a4750a52cc1	3499	CANCELLED	2026-02-06 04:43:20.092626	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
c61fde84-da58-408c-96ac-21ff9d072eb5	3499	CANCELLED	2026-02-06 09:15:31.922212	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
7e898098-ffde-4fc9-8bd4-6ea845c98ca7	3499	CANCELLED	2026-02-06 04:48:08.432419	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
d575ed66-95e8-41ca-9817-e8eab0c2ef57	3499	CANCELLED	2026-02-06 04:53:39.507677	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
b4a16179-0ea6-4cff-acce-f911db2af147	3499	CANCELLED	2026-02-06 06:09:56.093972	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
6798e561-b439-45b2-916c-86a4a44da892	3499	CANCELLED	2026-02-06 09:16:01.360435	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
d7869791-384c-4612-a3e8-4b4c8772dd61	3499	CANCELLED	2026-02-06 07:59:07.127614	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
881cc31d-6195-4b3d-a2d7-9e78b223908e	3499	CANCELLED	2026-02-06 08:41:55.99752	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
8917dc24-ed6e-40ec-b0da-7062ceb7b4ea	3499	CANCELLED	2026-02-06 10:59:47.912996	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
c2e65d95-fa62-4b7f-a1a6-a0ff41efe268	3499	CANCELLED	2026-02-06 08:44:17.365064	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
ee351124-5e95-493c-b912-2d10e065757e	3499	CANCELLED	2026-02-06 08:50:19.8828	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
53afb840-f94e-4d6f-ad65-fb5b8c8b5bf3	3499	CANCELLED	2026-02-06 13:11:26.050554	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
638b0775-f7d3-4019-8ffd-ee9772627127	3499	CANCELLED	2026-02-06 09:03:35.600462	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
6fa6a7c5-7e11-4e1f-bc0b-168045066a1f	3499	PAID	2026-02-09 11:09:39.940256	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	pi_3SysLYJzosDYZTpv154k9NRb	0
8eb6ce3f-c9ef-4b19-8160-2d1313902817	3499	CANCELLED	2026-02-07 04:45:58.266795	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	pi_3Sy3P8JzosDYZTpv0NaLZQf7	0
1002b0aa-dbb5-4474-8a7c-55a6be539606	3499	CANCELLED	2026-02-07 04:41:46.901168	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	pi_3Sy3L5JzosDYZTpv1V1W16Yo	0
66514eb2-8787-4093-851d-2a1ce3ad97db	1899	DELIVERED	2026-02-10 14:54:00.274131	8938bcf8-4ab9-45af-bccb-d54b2c48bca4	\N	pi_3SzIKCJzosDYZTpv008PkToM	0
aa2fe80f-5074-4efd-a62d-6ead4b7b38a5	3499	PAID	2026-02-09 11:19:49.907623	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	pi_3SysVOJzosDYZTpv1wHP7Rwp	0
e58f436a-2566-4645-b1f4-1fc898a77912	3499	PROCESSING	2026-02-09 03:25:33.07327	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	pi_3Syl6PJzosDYZTpv0cV2ISYj	0
a6a83909-1564-4e81-a8e9-b0f1d70b9d02	5937.8	CANCELLED	2026-02-11 04:26:45.395274	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	pi_3SzV0kJzosDYZTpv0cBt0CLy	0
5b01a3ed-49a2-471b-87b7-ee1b3f1f082c	4177.8	PAID	2026-02-11 03:18:33.75518	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	pi_3SzTwkJzosDYZTpv0co6PH93	0
05807422-efe5-40d5-8055-1ebc155c9f9a	2088.9	PAID	2026-02-11 04:46:11.692571	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	pi_3SzVJYJzosDYZTpv03fcIYEe	0
9f158be2-7c0f-436a-8640-6dc61c0bb002	1318.9	PAID	2026-02-12 09:36:46.328772	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
6b1adb66-6115-4645-9ec0-15385a8fb9a7	3848.9	SHIPPED	2026-02-12 09:41:55.383892	9df5c249-de04-4a72-8727-e8da3aeb0de3	\N	\N	0
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: electro_user
--

COPY public.products (id, "createdAt", "updatedAt", "categoryId", name, description, price, "imageUrl", stock, rating, "discountPercent", specs, "brandId", "isFeatured", "productCode") FROM stdin;
43461d08-c870-4b24-b675-b1e56f29eaab	2025-12-25 16:57:47.003639	2026-02-13 02:41:07.992674	f57a59a2-0499-419f-96b0-88d3efdc483f	iPhone 17 Pro Max	Innovative design for ultimate performance and battery life.	1199.00	http://localhost:3000/uploads/products/1767457984854-955063106-iphone-compare-iphone-17-pro-202509.jpeg	10	0.00	0	{}	3f8c5eaf-7261-41a8-aa94-d8fd5da5924e	t	8
c0de0d87-6acf-45b2-8c63-9e4284661cf7	2026-01-04 04:05:34.784321	2026-02-13 02:41:22.796024	f4621d53-a2ff-4edb-8564-c2500193769f	Apple Watch Ultra 3	The rugged 49mm aerospace-grade titanium case comes with precision dual-frequency GPS + Cellular connectivity and new built-in satellite communications.	799.00	http://localhost:3000/uploads/products/1767499534774-395426678-watch-compare-ultra3-202509_GEO_US.jpeg	20	0.00	0	{}	3f8c5eaf-7261-41a8-aa94-d8fd5da5924e	f	9
97dc9fd0-3cb2-4755-a3cc-27780b6badb5	2025-12-29 14:52:47.74577	2026-02-13 02:41:48.877952	8282eaa0-5db9-4eda-a418-bfb70d3210da	AirPods Pro 3	Now with the world’s best in‑ear Active Noise Cancellation,Footnote¹ all‑new heart rate sensing,Footnote² and up to 8 hours of battery life.Footnote¹⁴	249.00	http://localhost:3000/uploads/products/1767457510538-187045547-airpods-pro-3-hero-select-202509.jpeg	30	0.00	0	{}	3f8c5eaf-7261-41a8-aa94-d8fd5da5924e	f	6
933ab737-5a2a-45e3-aaee-39616cba4d95	2026-02-12 13:49:45.383398	2026-02-12 13:49:45.383398	635afd2d-1c19-49c8-94c9-07e1cd20eee1	ROG Rapture GT-BE19000AI	ASUS ROG Rapture GT-BE19000AI Tri-band Gaming Router, WiFi 7, 802.11be, up to 3,500 sq. ft. & 200+ devices, Triple Level Security, Support AiMesh Whole Home Mesh WiFi, Dual 10G ports, AI WAN detection, Energy Saving Mode, AI Game Boost, Gaming Network, Guest Network Pro	900.00	http://localhost:3000/uploads/products/1770904185371-585961917-2026-02-12 20.46.24.jpg	3	0.00	11	{}	de8cb041-2558-49aa-8092-20e56d5571f7	f	19
78f63f4e-d431-4c71-bf4f-6fbd13acf624	2026-01-03 14:12:45.452458	2026-02-13 02:42:22.282154	31faf6d3-ab50-4de3-8d74-8ee1763ea2af	MacBook Pro	MacBook Pro 16-inch (M4 Max), 36GB RAM, 1TB SSD, Liquid Retina XDR, 120Hz ProMotion.	3499.00	http://localhost:3000/uploads/products/1767500427817-997578611-mbp16-spaceblack-cto-hero-202410.jpeg	5	5.00	10	{}	3f8c5eaf-7261-41a8-aa94-d8fd5da5924e	t	12
76283e35-dc49-4130-b558-1e5d2aa10022	2026-01-04 04:12:35.306695	2026-02-13 02:42:25.292128	31faf6d3-ab50-4de3-8d74-8ee1763ea2af	MacBook Air	Powered by Apple M4 with 24GB RAM, 512GB SSD, 15.3″ Liquid Retina display, Thunderbolt 4, MagSafe 3, Touch ID, and 12MP Center Stage camera.	1599.00	http://localhost:3000/uploads/products/1767499955298-299651014-mba15-skyblue-select-202503.jpeg	10	0.00	0	{}	3f8c5eaf-7261-41a8-aa94-d8fd5da5924e	f	7
b60be1ce-4189-4619-a301-d6d096c6b33d	2026-01-16 08:11:32.555775	2026-02-13 02:42:37.604232	8282eaa0-5db9-4eda-a418-bfb70d3210da	Apple Vision Pro	Mixed reality headset by Apple	3499.00	http://localhost:3000/uploads/products/1768551092542-654081289-Apple-WWDC23-Vision-Pro-glass-230605_big.jpg.large.jpg	2	5.00	0	{"resolution":"4K per eye","tracking":"Inside-out"}	3f8c5eaf-7261-41a8-aa94-d8fd5da5924e	f	4
684afcd6-ef92-40f3-b309-efb1ff78f181	2026-01-04 04:01:52.148551	2026-02-13 02:42:39.073228	d1a01f1a-bc62-4692-9e3c-26543eb1b663	iPad Pro	The ultimate iPad experience with the most advanced technology.	1899.00	http://localhost:3000/uploads/products/1767499312137-789991696-ipad-compare-header-pro-202405.png	6	0.00	0	{}	3f8c5eaf-7261-41a8-aa94-d8fd5da5924e	t	14
475f943c-7401-47d7-886a-247b83d59dc9	2026-02-13 02:29:45.184726	2026-02-13 02:30:05.601665	e34d553e-8bf8-49ce-a92b-0fb16d22022e	98 Inch Class Neo QLED QN90F	The Samsung 98″ Class Neo QLED QN90F is a flagship 4K HDR Smart TV that combines cutting-edge display technology, powerful AI-enhanced picture processing, and immersive audio — all on a massive 98-inch screen. It’s designed for viewers who want cinema-like visuals, smooth motion performance, and intelligent smart features in a high-end home entertainment setup.	14999.00	http://localhost:3000/uploads/products/1770949785169-189229177-2026-02-13 09.27.38.jpg	1	0.00	7	{"brand":"Samsung","model":"","display_size":"95 inch","resolution":"4k","processor":"","ram":"","storage":"","operating_system":"","battery_capacity":"","camera":"","connectivity":"","stylus_support":"","dimensions":"","weight":""}	fe946063-95af-44ae-8123-e8d8f3428506	t	20
51e300a0-b220-4e6e-b79b-4f7dad5f3199	2026-02-13 02:46:56.032841	2026-02-13 02:46:56.032841	f4621d53-a2ff-4edb-8564-c2500193769f	Galaxy S25 Ultra	The Samsung Galaxy S25 Ultra is a premium flagship smartphone designed for users who want top-tier performance, cutting-edge camera capabilities, long software support, and advanced AI-enhanced features. It represents the highest-end model in Samsung’s Galaxy S25 lineup, blending powerful hardware with intelligent software to elevate everyday mobile experiences	1409.99	http://localhost:3000/uploads/products/1770950816022-319014069-2026-02-13 09.45.39.jpg	20	0.00	0	{"brand":"","model":"","display_type":"","display_size":"","resolution":"","operating_system":"","battery_life":"","sensors":"","water_resistance":"","connectivity":"","compatibility":"","weight":""}	fe946063-95af-44ae-8123-e8d8f3428506	f	21
8aa902b1-9817-440c-b24c-5120914dbff4	2026-02-13 02:53:46.208413	2026-02-13 02:54:50.164291	8282eaa0-5db9-4eda-a418-bfb70d3210da	Galaxy XR	The Samsung Galaxy XR is a premium mixed reality (XR) headset that blends augmented reality (AR), virtual reality (VR), and AI-powered experiences into one immersive device. It represents Samsung’s first major product in a new XR ecosystem developed in partnership with Google and Qualcomm, and it runs on the Android XR operating system — a platform designed specifically for extended reality applications.	1799.99	http://localhost:3000/uploads/products/1770951226198-276649198-2026-02-13 09.52.52.jpg	2	0.00	0	{"brand":"","model":"","display_type":"","display_size":"","resolution":"","operating_system":"","battery_life":"","sensors":"","water_resistance":"","connectivity":"","compatibility":"","weight":""}	fe946063-95af-44ae-8123-e8d8f3428506	f	22
\.


--
-- Data for Name: subscribers; Type: TABLE DATA; Schema: public; Owner: electro_user
--

COPY public.subscribers (id, email, "createdAt") FROM stdin;
f24be288-5b54-460e-bec1-841d92f79f04	test@gmail.com	2026-01-22 14:18:02.78416
479a8747-117b-49e3-b36e-dde9f2bd39c8	test2@gmail.com	2026-01-22 14:44:45.582223
4cc54006-e4ee-45f2-8b2c-f27a86483cbc	test3@gmail.com	2026-01-22 14:47:07.479884
ec4e42e4-74f3-49f5-95a2-2c2d858eb204	test5@gmail.com	2026-01-22 14:47:19.512668
85720bb0-0d33-4c8b-9c39-6f6686ae82a5	test6@gmail.com	2026-01-22 14:47:45.379503
d1500bd2-a0d3-474f-a2bd-e4652c7a705c	test8@gmail.com	2026-01-22 14:47:54.935312
ac905d5d-2a3e-44db-8375-41062f978b9c	test10@gmail.com	2026-01-22 14:48:13.726683
ee85a6b4-f8ab-46e8-a36a-60fe50dece79	dodavin@gmail.com	2026-02-09 10:55:48.111544
849741be-3a9a-42ea-b369-ccd6aba9c6d0	dodavin96@gmail.com	2026-02-12 09:39:34.594496
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: electro_user
--

COPY public.users (id, email, password, "createdAt", "updatedAt", role, "firstName", "lastName", phone, gender, "dateOfBirth", avatar, "addressStreet", "addressCity", "addressState", "addressPostCode", "addressCountry") FROM stdin;
f73b3b47-053b-44fa-9412-80a6d163c6f2	notdavin@gmail.com	123456	2025-12-26 02:16:46.614299	2025-12-26 02:16:46.614299	USER	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2a36e02a-3503-4867-a769-8ed279ae704c	test@gmail.com	$2b$10$eD7GumGiygUU21/mgAm6kOCApQYpZG4qY3UNM4G59cq4mFjZ0x6X.	2025-12-26 03:16:51.004842	2025-12-26 03:16:51.004842	USER	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
48abde49-0e37-4c86-8045-0837b3777e5c	thyda@gmail.com	$2b$10$xdCZ4l06103173XB2/uHruhpDyb0JptWjlzrQ.v0riU3brS3KnDpG	2025-12-27 06:03:07.945377	2025-12-27 06:03:07.945377	USER	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
3e13fd21-f689-45c7-9e66-7b353e5ddbb8	kolthyda@gmail.com	$2b$10$TaoNmvo8gFcqg741PSt2GO7s8zL6OfacZ271SgDyxSNaVidZ0./O2	2025-12-27 06:04:44.875212	2025-12-27 06:04:44.875212	USER	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
8542dcfa-0623-4fd9-b30e-bd7f5e39fa6c	testadmin@gmail.com	$2b$10$Glzpk6ryztEVAM/5kWhYY.mNzyfYtP8NR1EXb6ONnomcvxV7BJdU6	2025-12-27 16:26:51.971132	2025-12-27 16:26:51.971132	ADMIN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2dd1e185-84b0-4a15-81b3-d710e3571511	davinhacker@gmail.com	$2b$10$BrpycOu.WU69xYpXu.u1LO34uNJePsEJcoRDzAON6PrxEGZQ4fhf.	2026-01-02 09:45:05.874411	2026-01-02 09:45:05.874411	USER	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
cea2b3a2-d80c-4f76-beca-268fbe6f8378	davin2@gmail.com	$2b$10$RP5fXg2mW/6TsWBhluKmCe28l3lxyUMVBBYArRbkSvNLNUopHD9ju	2026-01-02 09:47:24.11868	2026-01-02 09:47:24.11868	ADMIN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
54d8582f-366d-4fa3-9292-99ae1a4fcf4e	test2@gmail.com	$2b$10$L6xs2vaUkebwcg38GQihmecLkssNhQgdLasMAYpdQF4jWvQJpiRMi	2026-01-11 07:24:20.227555	2026-01-11 07:24:20.227555	USER	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
8938bcf8-4ab9-45af-bccb-d54b2c48bca4	davin@gmail.com	$2b$10$bLFlOubYbF8/hK125j7ZW./RDKdAXGQvBU2cV3DRwDgoP.wLevi5u	2026-02-04 10:12:08.652791	2026-02-04 10:12:08.652791	USER	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
9df5c249-de04-4a72-8727-e8da3aeb0de3	demo@gmail.com	$2b$10$FqJKJfJ6nI2fks2hbSdqGes15mY3zMtmF.O71/AZK/9WIfGrMduTm	2026-01-12 11:37:14.872109	2026-02-12 01:43:33.164713	USER	de	mo	012345678	male	2011-11-11	http://localhost:3000/uploads/avatars/1770860613148-987598630-dodavin.jpg	108	Phnom Penh	Phnom Penh	120804	Cambodia
\.


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: electro_user
--

SELECT pg_catalog.setval('public.migrations_id_seq', 1, true);


--
-- Name: products_productCode_seq; Type: SEQUENCE SET; Schema: public; Owner: electro_user
--

SELECT pg_catalog.setval('public."products_productCode_seq"', 22, true);


--
-- Name: order_items PK_005269d8574e6fac0493715c308; Type: CONSTRAINT; Schema: public; Owner: electro_user
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY (id);


--
-- Name: products PK_0806c755e0aca124e67c0cf6d7d; Type: CONSTRAINT; Schema: public; Owner: electro_user
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY (id);


--
-- Name: categories PK_24dbc6126a28ff948da33e97d3b; Type: CONSTRAINT; Schema: public; Owner: electro_user
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id);


--
-- Name: orders PK_710e2d4957aa5878dfe94e4ac2f; Type: CONSTRAINT; Schema: public; Owner: electro_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: electro_user
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: electro_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: brands PK_b0c437120b624da1034a81fc561; Type: CONSTRAINT; Schema: public; Owner: electro_user
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY (id);


--
-- Name: subscribers PK_cbe0a7a9256c826f403c0236b67; Type: CONSTRAINT; Schema: public; Owner: electro_user
--

ALTER TABLE ONLY public.subscribers
    ADD CONSTRAINT "PK_cbe0a7a9256c826f403c0236b67" PRIMARY KEY (id);


--
-- Name: subscribers UQ_1a7163c08f0e57bd1c9821508b1; Type: CONSTRAINT; Schema: public; Owner: electro_user
--

ALTER TABLE ONLY public.subscribers
    ADD CONSTRAINT "UQ_1a7163c08f0e57bd1c9821508b1" UNIQUE (email);


--
-- Name: categories UQ_8b0be371d28245da6e4f4b61878; Type: CONSTRAINT; Schema: public; Owner: electro_user
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE (name);


--
-- Name: brands UQ_96db6bbbaa6f23cad26871339b6; Type: CONSTRAINT; Schema: public; Owner: electro_user
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT "UQ_96db6bbbaa6f23cad26871339b6" UNIQUE (name);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: electro_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: products UQ_products_productCode; Type: CONSTRAINT; Schema: public; Owner: electro_user
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "UQ_products_productCode" UNIQUE ("productCode");


--
-- Name: orders FK_151b79a83ba240b0cb31b2302d1; Type: FK CONSTRAINT; Schema: public; Owner: electro_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: order_items FK_cdb99c05982d5191ac8465ac010; Type: FK CONSTRAINT; Schema: public; Owner: electro_user
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "FK_cdb99c05982d5191ac8465ac010" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: products FK_ea86d0c514c4ecbb5694cbf57df; Type: FK CONSTRAINT; Schema: public; Owner: electro_user
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "FK_ea86d0c514c4ecbb5694cbf57df" FOREIGN KEY ("brandId") REFERENCES public.brands(id) ON DELETE RESTRICT;


--
-- Name: order_items FK_f1d359a55923bb45b057fbdab0d; Type: FK CONSTRAINT; Schema: public; Owner: electro_user
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: products FK_ff56834e735fa78a15d0cf21926; Type: FK CONSTRAINT; Schema: public; Owner: electro_user
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict kDexVKoebwY7lxslZHqdjIRspenDWtybFN6GDIsEjvXoL2rYwmgrpvfGTiMZN5Z

