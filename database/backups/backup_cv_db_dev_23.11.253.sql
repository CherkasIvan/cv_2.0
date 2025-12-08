--
-- PostgreSQL database dump
--

\restrict ktW7gpE0nvF7I3LCO41WyHzvEeN1aSvzzARQq88nwzVzuqq7MmZx7lhxhYlEol0

-- Dumped from database version 18.0 (Debian 18.0-1.pgdg13+3)
-- Dumped by pg_dump version 18.0 (Debian 18.0-1.pgdg13+3)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: auth_sessions; Type: TABLE; Schema: public; Owner: jv13
--

CREATE TABLE public.auth_sessions (
    id integer NOT NULL,
    uid character varying,
    email character varying,
    token character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.auth_sessions OWNER TO jv13;

--
-- Name: auth_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: jv13
--

CREATE SEQUENCE public.auth_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.auth_sessions_id_seq OWNER TO jv13;

--
-- Name: auth_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jv13
--

ALTER SEQUENCE public.auth_sessions_id_seq OWNED BY public.auth_sessions.id;


--
-- Name: education_experience; Type: TABLE; Schema: public; Owner: jv13
--

CREATE TABLE public.education_experience (
    id integer NOT NULL,
    "logoPath" character varying,
    alt character varying,
    "iconPath" character varying,
    company character varying,
    "from" character varying,
    "to" character varying,
    place character varying,
    link character varying,
    specialization character varying,
    "workTime" character varying,
    "imgName" character varying,
    images text,
    type character varying DEFAULT 'education'::character varying
);


ALTER TABLE public.education_experience OWNER TO jv13;

--
-- Name: education_experience_id_seq; Type: SEQUENCE; Schema: public; Owner: jv13
--

CREATE SEQUENCE public.education_experience_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.education_experience_id_seq OWNER TO jv13;

--
-- Name: education_experience_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jv13
--

ALTER SEQUENCE public.education_experience_id_seq OWNED BY public.education_experience.id;


--
-- Name: experience_aside; Type: TABLE; Schema: public; Owner: jv13
--

CREATE TABLE public.experience_aside (
    id integer NOT NULL,
    title character varying,
    value character varying,
    "imgName" character varying,
    images text
);


ALTER TABLE public.experience_aside OWNER TO jv13;

--
-- Name: experience_aside_id_seq; Type: SEQUENCE; Schema: public; Owner: jv13
--

CREATE SEQUENCE public.experience_aside_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.experience_aside_id_seq OWNER TO jv13;

--
-- Name: experience_aside_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jv13
--

ALTER SEQUENCE public.experience_aside_id_seq OWNED BY public.experience_aside.id;


--
-- Name: hard_skills_nav; Type: TABLE; Schema: public; Owner: jv13
--

CREATE TABLE public.hard_skills_nav (
    id integer NOT NULL,
    link character varying,
    value character varying,
    "imgName" character varying,
    images text
);


ALTER TABLE public.hard_skills_nav OWNER TO jv13;

--
-- Name: hard_skills_nav_id_seq; Type: SEQUENCE; Schema: public; Owner: jv13
--

CREATE SEQUENCE public.hard_skills_nav_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hard_skills_nav_id_seq OWNER TO jv13;

--
-- Name: hard_skills_nav_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jv13
--

ALTER SEQUENCE public.hard_skills_nav_id_seq OWNED BY public.hard_skills_nav.id;


--
-- Name: main_page_info; Type: TABLE; Schema: public; Owner: jv13
--

CREATE TABLE public.main_page_info (
    id integer NOT NULL,
    "buttonHoverText" character varying,
    "buttonText" character varying,
    description character varying,
    name character varying,
    "imgSrc" character varying,
    stack character varying,
    status character varying,
    "imgName" character varying,
    images text
);


ALTER TABLE public.main_page_info OWNER TO jv13;

--
-- Name: main_page_info_id_seq; Type: SEQUENCE; Schema: public; Owner: jv13
--

CREATE SEQUENCE public.main_page_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.main_page_info_id_seq OWNER TO jv13;

--
-- Name: main_page_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jv13
--

ALTER SEQUENCE public.main_page_info_id_seq OWNED BY public.main_page_info.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: jv13
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO jv13;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: jv13
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO jv13;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jv13
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: navigation; Type: TABLE; Schema: public; Owner: jv13
--

CREATE TABLE public.navigation (
    id integer NOT NULL,
    link character varying,
    "position" integer,
    value character varying,
    "imgName" character varying,
    images text
);


ALTER TABLE public.navigation OWNER TO jv13;

--
-- Name: navigation_id_seq; Type: SEQUENCE; Schema: public; Owner: jv13
--

CREATE SEQUENCE public.navigation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.navigation_id_seq OWNER TO jv13;

--
-- Name: navigation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jv13
--

ALTER SEQUENCE public.navigation_id_seq OWNED BY public.navigation.id;


--
-- Name: persons; Type: TABLE; Schema: public; Owner: jv13
--

CREATE TABLE public.persons (
    id integer NOT NULL,
    name character varying,
    "position" character varying,
    email character varying,
    phone character varying,
    avatar character varying,
    bio character varying,
    location character varying,
    password character varying(255),
    "isAdmin" boolean DEFAULT false
);


ALTER TABLE public.persons OWNER TO jv13;

--
-- Name: persons_id_seq; Type: SEQUENCE; Schema: public; Owner: jv13
--

CREATE SEQUENCE public.persons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.persons_id_seq OWNER TO jv13;

--
-- Name: persons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jv13
--

ALTER SEQUENCE public.persons_id_seq OWNED BY public.persons.id;


--
-- Name: project; Type: TABLE; Schema: public; Owner: jv13
--

CREATE TABLE public.project (
    id integer NOT NULL,
    title character varying,
    description character varying,
    technologies text,
    "githubUrl" character varying,
    "liveUrl" character varying,
    images text,
    alt character varying,
    category character varying,
    status character varying,
    "startDate" character varying,
    "endDate" character varying
);


ALTER TABLE public.project OWNER TO jv13;

--
-- Name: project_id_seq; Type: SEQUENCE; Schema: public; Owner: jv13
--

CREATE SEQUENCE public.project_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_id_seq OWNER TO jv13;

--
-- Name: project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jv13
--

ALTER SEQUENCE public.project_id_seq OWNED BY public.project.id;


--
-- Name: repositories; Type: TABLE; Schema: public; Owner: jv13
--

CREATE TABLE public.repositories (
    id integer NOT NULL,
    name character varying,
    description character varying,
    url character varying,
    language character varying,
    stars integer DEFAULT 0,
    forks integer DEFAULT 0,
    "updatedAt" character varying,
    topics text
);


ALTER TABLE public.repositories OWNER TO jv13;

--
-- Name: repositories_id_seq; Type: SEQUENCE; Schema: public; Owner: jv13
--

CREATE SEQUENCE public.repositories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.repositories_id_seq OWNER TO jv13;

--
-- Name: repositories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jv13
--

ALTER SEQUENCE public.repositories_id_seq OWNED BY public.repositories.id;


--
-- Name: social_media; Type: TABLE; Schema: public; Owner: jv13
--

CREATE TABLE public.social_media (
    id integer NOT NULL,
    link character varying,
    value character varying,
    "imgName" character varying,
    "position" integer DEFAULT 0 NOT NULL,
    images text
);


ALTER TABLE public.social_media OWNER TO jv13;

--
-- Name: social_media_id_seq; Type: SEQUENCE; Schema: public; Owner: jv13
--

CREATE SEQUENCE public.social_media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.social_media_id_seq OWNER TO jv13;

--
-- Name: social_media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jv13
--

ALTER SEQUENCE public.social_media_id_seq OWNED BY public.social_media.id;


--
-- Name: technologies_aside; Type: TABLE; Schema: public; Owner: jv13
--

CREATE TABLE public.technologies_aside (
    id integer NOT NULL,
    title character varying,
    value character varying,
    "imgName" character varying,
    images text
);


ALTER TABLE public.technologies_aside OWNER TO jv13;

--
-- Name: technologies_aside_id_seq; Type: SEQUENCE; Schema: public; Owner: jv13
--

CREATE SEQUENCE public.technologies_aside_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.technologies_aside_id_seq OWNER TO jv13;

--
-- Name: technologies_aside_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jv13
--

ALTER SEQUENCE public.technologies_aside_id_seq OWNED BY public.technologies_aside.id;


--
-- Name: technology; Type: TABLE; Schema: public; Owner: jv13
--

CREATE TABLE public.technology (
    id integer NOT NULL,
    alt character varying,
    "iconPath" character varying,
    link character varying,
    "technologyName" character varying,
    "imgName" character varying,
    images text,
    category character varying
);


ALTER TABLE public.technology OWNER TO jv13;

--
-- Name: technology_id_seq; Type: SEQUENCE; Schema: public; Owner: jv13
--

CREATE SEQUENCE public.technology_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.technology_id_seq OWNER TO jv13;

--
-- Name: technology_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jv13
--

ALTER SEQUENCE public.technology_id_seq OWNED BY public.technology.id;


--
-- Name: themeless_pictures; Type: TABLE; Schema: public; Owner: jv13
--

CREATE TABLE public.themeless_pictures (
    id integer NOT NULL,
    name character varying,
    "darkModeIconPath" character varying,
    "whiteModeIconPath" character varying,
    "imgSrc" character varying,
    alt character varying
);


ALTER TABLE public.themeless_pictures OWNER TO jv13;

--
-- Name: themeless_pictures_id_seq; Type: SEQUENCE; Schema: public; Owner: jv13
--

CREATE SEQUENCE public.themeless_pictures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.themeless_pictures_id_seq OWNER TO jv13;

--
-- Name: themeless_pictures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jv13
--

ALTER SEQUENCE public.themeless_pictures_id_seq OWNED BY public.themeless_pictures.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: jv13
--

CREATE TABLE public.users (
    uid character varying NOT NULL,
    email character varying,
    "displayName" character varying,
    "photoURL" character varying,
    "createdAt" character varying,
    "lastLoginAt" character varying,
    password character varying,
    "isAdmin" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users OWNER TO jv13;

--
-- Name: work_experience; Type: TABLE; Schema: public; Owner: jv13
--

CREATE TABLE public.work_experience (
    id integer NOT NULL,
    "logoPath" character varying,
    alt character varying,
    "iconPath" character varying,
    company character varying,
    "from" character varying,
    "to" character varying,
    place character varying,
    link character varying,
    specialization character varying,
    "workTime" character varying,
    "imgName" character varying,
    images text,
    type character varying DEFAULT 'work'::character varying
);


ALTER TABLE public.work_experience OWNER TO jv13;

--
-- Name: work_experience_id_seq; Type: SEQUENCE; Schema: public; Owner: jv13
--

CREATE SEQUENCE public.work_experience_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.work_experience_id_seq OWNER TO jv13;

--
-- Name: work_experience_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jv13
--

ALTER SEQUENCE public.work_experience_id_seq OWNED BY public.work_experience.id;


--
-- Name: auth_sessions id; Type: DEFAULT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.auth_sessions ALTER COLUMN id SET DEFAULT nextval('public.auth_sessions_id_seq'::regclass);


--
-- Name: education_experience id; Type: DEFAULT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.education_experience ALTER COLUMN id SET DEFAULT nextval('public.education_experience_id_seq'::regclass);


--
-- Name: experience_aside id; Type: DEFAULT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.experience_aside ALTER COLUMN id SET DEFAULT nextval('public.experience_aside_id_seq'::regclass);


--
-- Name: hard_skills_nav id; Type: DEFAULT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.hard_skills_nav ALTER COLUMN id SET DEFAULT nextval('public.hard_skills_nav_id_seq'::regclass);


--
-- Name: main_page_info id; Type: DEFAULT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.main_page_info ALTER COLUMN id SET DEFAULT nextval('public.main_page_info_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: navigation id; Type: DEFAULT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.navigation ALTER COLUMN id SET DEFAULT nextval('public.navigation_id_seq'::regclass);


--
-- Name: persons id; Type: DEFAULT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.persons ALTER COLUMN id SET DEFAULT nextval('public.persons_id_seq'::regclass);


--
-- Name: project id; Type: DEFAULT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.project ALTER COLUMN id SET DEFAULT nextval('public.project_id_seq'::regclass);


--
-- Name: repositories id; Type: DEFAULT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.repositories ALTER COLUMN id SET DEFAULT nextval('public.repositories_id_seq'::regclass);


--
-- Name: social_media id; Type: DEFAULT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.social_media ALTER COLUMN id SET DEFAULT nextval('public.social_media_id_seq'::regclass);


--
-- Name: technologies_aside id; Type: DEFAULT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.technologies_aside ALTER COLUMN id SET DEFAULT nextval('public.technologies_aside_id_seq'::regclass);


--
-- Name: technology id; Type: DEFAULT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.technology ALTER COLUMN id SET DEFAULT nextval('public.technology_id_seq'::regclass);


--
-- Name: themeless_pictures id; Type: DEFAULT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.themeless_pictures ALTER COLUMN id SET DEFAULT nextval('public.themeless_pictures_id_seq'::regclass);


--
-- Name: work_experience id; Type: DEFAULT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.work_experience ALTER COLUMN id SET DEFAULT nextval('public.work_experience_id_seq'::regclass);


--
-- Data for Name: auth_sessions; Type: TABLE DATA; Schema: public; Owner: jv13
--

COPY public.auth_sessions (id, uid, email, token, created_at) FROM stdin;
\.


--
-- Data for Name: education_experience; Type: TABLE DATA; Schema: public; Owner: jv13
--

COPY public.education_experience (id, "logoPath", alt, "iconPath", company, "from", "to", place, link, specialization, "workTime", "imgName", images, type) FROM stdin;
28	/assets/images/certificates/excel.jpg	excel.jpg	https://storage.googleapis.com/cv-cherkas-db.appspot.com/certificates/stepik-excel.jpg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=UYBGsuJVRoi%2FwohD%2BC9zfht99AVxL5s9EHLmbZdmSLNMcQjeA4pZXkvlsI%2F97%2FSovpud07K%2B7Dzb%2BTWJEr%2BaDTzrQrjVS9O7W4IVmFIX2vYc3GEqx1rcawd85WZER%2F%2BnqmeKKwjc067nc14dyoHaySom2WvmFYQNrwgoIVvi7ZvwOwARLK3kmaspf2jnTr4npgF0Gq6sHsp7yh5WrCEYnI1m5TISaxLdST1D6Wv050%2FAmoawZZds1Ve%2BeyXecpH9jXEEhCLwpCwIKiqz5uL5pEcy%2BoCmyWNz8BplCtkJB7KXi9WaIAsrEju00UgG%2BLHbnIwg9qaH2u4bnSpjM2y3aA%3D%3D	Stepik	15-06-2022	15-08-2022	г. Москва, Россия	https://stepik.org/cert/1953522	Базовые навыки Excel		default-image.jpg		education
29	/assets/images/certificates/js.jpg	js.jpg		Stepic	27-06-2021	27-08-2021	г. Москва, Россия	https://stepik.org/cert/1065968	JavaScript для начинающих		default-image.jpg		education
30	/assets/images/certificates/tms-js.jpg	tms-js.jpg		TeachMeSkills	05-09-2022	15-07-2023	ул. Тимирязева 67, Минск, РБ	https://teachmeskills.by/kursy/frontend-html-css-javascript-online	Frontend Developer		default-image.jpg		education
31	/assets/images/certificates/c-sharp.jpg	c-sharp.jpg		Stepik	15-03-2020	15-06-2021	г. Москва, Россия	https://stepik.org/cert/320534	Основы программирования на C#		default-image.jpg		education
32	/assets/images/certificates/html-css.jpg	html-css.jpg		Stepic	02-06-2020	02-08-2020	г. Москва, Россия	https://stepik.org/cert/493389	Веб-разработка CSS для начинающих: HTML и 		default-image.jpg		education
33	/assets/images/certificates/it-academy.jpg	it-academy.jpg	https://storage.googleapis.com/cv-cherkas-db.appspot.com/certificates/it-academy.jpg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=j319D14dwOjPIBSf3dxzoNGEW9P4%2BcGytekiQnvKlmXqilHZTxz4hSIJYeT0N0YuLX282tNU4T8hdshDXhlTkstMhapSE%2BydmLde9En7Is5utk16Z25BCY1E9sABt7O6U%2F3Vmk0IunMfoHdc44q1ejJ9CKS20wXcfpU8H8azO9vvhyqgN5B3S2JNWLkYZytQajfdkH%2F0nIvYuuNf1x8ZjIAdzY23l1alfK38oreEWyj%2FXvXMfAeC5ZTikbHOT9e8c%2BOs8Ei2wIfvY%2BprRzo0HAQW3%2F4IoyPFC3oBSQHLCZR3mP%2Bdt3up4Ax6a54CNjoL8xADxu4%2FTzF3JCCv4Boj4Q%3D%3D	IT Academy	15-03-2020	15-07-2020	ул. Скрыганова, д. 14, 5-ый этаж, г. Минск, РБ	https://www.it-academy.by/course/asp-net-developer	Базовый C#		default-image.jpg		education
34	/assets/images/certificates/web-design.jpg	web-design.jpg	https://storage.googleapis.com/cv-cherkas-db.appspot.com/certificates/web-design.jpg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=oEQHWx4fl4sGKH5rOO7Cj8jE6lZoqytnmehuqELjazI%2FPlQ2I4A3AsnPI2xzTRCHxvz7K37sh9zUyoBOxCY3CwIVF4nsWAiKy4CvopbbuDodmOGRI3jMBQz%2FX%2FyyE1hiJslEPnt7RMQZ0FDFSt6Br5V6sLvrvVB0TvEWGP0WS2cH6RgYhZnwl9yhm638H%2FN2nBPJ4W68o%2FRGxf6rZVpCXmsp3lDihysd7f0eHed2TdToilSfQXDNx0Oc8knSkYM5WclzkTf0ca0Sc1lfJmTZpwvd%2Fi8pbOjpzY%2Bj6VFYPVU%2BPx%2BHOV9w6AflPkpgXD0ePebwhJr4Y0PdMBECa1ChqQ%3D%3D	HIGHLIGHTS	17-02-2021	17-05-2021	г. Санкт-Петербург, Россия	https://vk.com/doc348769408_600252239?hash=ZZz4zd9kF2bgWKmToCocbpHXRFkex0GBKUvXCzDDe1P&dl=GRfKAi8I66Cc2BaAJxFrnYIsHlFLK6TlkUxMoRElYVP	Основы веб-дизайна в Adobe Photoshop 		default-image.jpg		education
35	/assets/images/certificates/miu.jpg	miu.jpg	https://storage.googleapis.com/cv-cherkas-db.appspot.com/certificates/miu.jpg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=fQmWVzVy2HA02QSPCt9mZsGXj8Hc8i%2FQ6pAk6ApBngGIXSFwkNUHT42xYETqc67i6jjerXaUXRf53wBjWnO%2BFR6U6r8K5Xp5anNW2TAZRayMJOyyyEOSu9vsnj634bzjKhX0rwf8%2BDkYMuAQow1i5Kc%2BC94PJiAmSdjoGCDwCNgEo2ndhcYgbV93dZZq6I3uvr5lvs9NYXTCo%2FjADfsoh7gYhAEQzQwXeIuK4baJZpX9Y9Gt%2BxhlzF4qDlZjEfiDq6QlDG%2BbfOb%2FbYxuWEqyhJYk5VJU6%2F7eCvHgKcNlfstOXM5g8fKvmQXVop9xqcEIQsIwLrSrrcyZgH6K0m3yAA%3D%3D	МИУ (Минский инновационный университет)	01-09-2016	20-07-2020	ул. Лазо, д. 14,г. Минск, РБ	https://www.facebook.com/ByMIU/?locale=ru_RU	Менеджер-экономист (Инновационный менеджмент)		default-image.jpg		education
36	/assets/images/certificates/docker.jpg	docker.jpg	https://storage.googleapis.com/cv-cherkas-db.appspot.com/certificates/docker.jpg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=NimMs4Vww%2BJEgfgY%2BIn%2BFagpKElOp18dGk76xE8YILAZ7s5x1sRgJLrXbz%2BCHDJQEj3rYYRDyEpHCh1r5aMWh7qeXXGo9h%2B%2BUDz6NqHRBpPCaAapOyDL2PZLm9mefHwN5yeWAx1jUeKNDKR%2FFx8rtZ3zIUmU0ZzxIRw8QCukGIxbrcdmXIoXFAUxlaWipTOPlp2O%2BNE2EPfC5YG1Wz08LpNhFS9BClYD4QSXh8CU6YCVFXEYBNAYxYwhBrJUTOe91La%2BO0xMk7aeCf5CcLnBpJOiUuwPG7eYMhMbsrQ3EvhovJ4kDM%2FTjjxebseulwQoQEzVz6yaL5u6fCQvzrGKJw%3D%3D	Udemy	10-08-2024	10-11-2024	г. Москва, Россия	https://www.udemy.com/certificate/UC-7515570c-b2cc-4567-a4c8-6a15481404eb/	Docker - полный курс		default-image.jpg		education
\.


--
-- Data for Name: experience_aside; Type: TABLE DATA; Schema: public; Owner: jv13
--

COPY public.experience_aside (id, title, value, "imgName", images) FROM stdin;
7	Опыт работы	work		
8	Образование	education		
\.


--
-- Data for Name: hard_skills_nav; Type: TABLE DATA; Schema: public; Owner: jv13
--

COPY public.hard_skills_nav (id, link, value, "imgName", images) FROM stdin;
9	frontend	Навыки стороны клиента	\N	\N
10	backend	Навыки стороны сервера	\N	\N
\.


--
-- Data for Name: main_page_info; Type: TABLE DATA; Schema: public; Owner: jv13
--

COPY public.main_page_info (id, "buttonHoverText", "buttonText", description, name, "imgSrc", stack, status, "imgName", images) FROM stdin;
4	Открыть СV	Смотреть CV	Меня зовут Черкас Иван, и я являюсь фул-стэк разработчик с опытом работы более 3 лет.	ivan cherkas	assets/images/projects-logo/project-link-button.png	full-stack	developer	\N	
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: jv13
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
\.


--
-- Data for Name: navigation; Type: TABLE DATA; Schema: public; Owner: jv13
--

COPY public.navigation (id, link, "position", value, "imgName", images) FROM stdin;
17	projects	3	проекты		
18	experience	2	опыт работы и образование		
19	main	1	главная		
20	technologies	4	технологии		
\.


--
-- Data for Name: persons; Type: TABLE DATA; Schema: public; Owner: jv13
--

COPY public.persons (id, name, "position", email, phone, avatar, bio, location, password, "isAdmin") FROM stdin;
10	Иван Черкас	\N	\N					\N	f
11	Александр Зябликов	\N	\N					\N	f
12	Даша Подобед	\N	\N					\N	f
\.


--
-- Data for Name: project; Type: TABLE DATA; Schema: public; Owner: jv13
--

COPY public.project (id, title, description, technologies, "githubUrl", "liveUrl", images, alt, category, status, "startDate", "endDate") FROM stdin;
10	все	\N									
11	приватные	\N									
12	публичные	\N									
\.


--
-- Data for Name: repositories; Type: TABLE DATA; Schema: public; Owner: jv13
--

COPY public.repositories (id, name, description, url, language, stars, forks, "updatedAt", topics) FROM stdin;
70	\N	\N	\N		0	0		
71	\N	\N	\N		0	0		
72	\N	\N	\N		0	0		
73	\N	\N	\N		0	0		
74	\N	\N	\N		0	0		
75	\N	\N	\N		0	0		
76	\N	 The application was implemented as an example of PVA work AND WORKER SERVICE	\N		0	0		
77	\N	\N	\N		0	0		
78	\N	\N	\N		0	0		
79	\N	\N	\N		0	0		
80	\N	microfrontenf part in front	\N		0	0		
81	\N	\N	\N		0	0		
82	\N	Completely went the way of the samurai! Even before it became a main stream and it-incubator appeared.	\N		0	0		
83	\N	This app was upgraded by me from English version 7 to 19	\N		0	0		
84	\N		\N		0	0		
85	\N	Hover effects	\N		0	0		
86	\N	\N	\N		0	0		
87	\N	\N	\N		0	0		
88	\N	\N	\N		0	0		
89	\N	\N	\N		0	0		
90	\N	\N	\N		0	0		
91	\N	\N	\N		0	0		
92	\N	\N	\N		0	0		
\.


--
-- Data for Name: social_media; Type: TABLE DATA; Schema: public; Owner: jv13
--

COPY public.social_media (id, link, value, "imgName", "position", images) FROM stdin;
23	https://www.facebook.com/ivan.cherkas	facebook	\N	0	
24	mailto: cherkas.ivan13@gmail.com	email	\N	1	
25	https://github.com/CherkasIvan	github	\N	2	
26	https://vk.com/cherkasss	vkontakte	\N	3	
27	live:.cid.270d4d79826c9a4d	skype	\N	4	
28	https://www.linkedin.com/in/ivan-cherkas-723b411a2	linkedin	\N	5	
29	https://t.me/IvanCherkas	telegram	\N	6	
\.


--
-- Data for Name: technologies_aside; Type: TABLE DATA; Schema: public; Owner: jv13
--

COPY public.technologies_aside (id, title, value, "imgName", images) FROM stdin;
7	Технические навыки	technologies		
8	Остальные навыки	other		
\.


--
-- Data for Name: technology; Type: TABLE DATA; Schema: public; Owner: jv13
--

COPY public.technology (id, alt, "iconPath", link, "technologyName", "imgName", images, category) FROM stdin;
70	angular-universal	https://storage.googleapis.com/cv-cherkas-db.appspot.com/technologies/backend/angular-universal.svg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=mA%2F5ixJM9pYmrGRiBXvS7hXOVlJt1wu8FfTBlDBp5ub5286ktrSyCNh9g5LAAHFwMARGhsF%2Bd2VuBc8p2J4sa7yh2zIzIJTFEdvOmIxM5Qo08cTDK2Ndiy3s4sPA8eVf2VHNMMByGUU%2F74u5IMbnlhsqei5Sr9ADZ2%2FNVzSHlmJHDVn%2BWHyWLq8%2BD5cALWlfnbxvMDMmD6AfLLeLc0IU%2BU7jcYjClX9jRPDJkzJ8P0AhxkVXS2HKbEWOMna91sGDpgv%2Bql6zrQZEPa6ZaTjIrD3rv3BC8w%2Fc52Z8QgVTzst7P00HPdjaVglvttBtN5DGgjO54mvLD5F2%2FBDYf28peQ%3D%3D	https://angular.io/guide/universal	angular universal	\N		backend
71	docker	https://storage.googleapis.com/cv-cherkas-db.appspot.com/technologies/backend/docker.svg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=UumUR0KqJTXFDkNFaDUiCogwYcXxNnAfhb12trmDwoGB0t4RX3IGmCq7dcHYYqKv7%2FN8FFKZ0vmSd5M92alqKOdhazaarn7uQFHqXvE2Cx%2FQVpgdOoDSaV3hzcMW3nZI7ENdwRz%2BBGTXWn%2F8bnoufdZ0%2FAwVMSaGgTiRxSt4yl%2BQhcEFBI1%2B%2BZQRE%2BioOJuusERye6u6o0tPx2%2B8FxhWmtvDeJVE3O8A4OqgNOo3lcr2iszSh4pQIS3RJ4BZS4vmKcdPLjDpGmfeLMIdr2aPoQuYZoo0r1X4dj2pTosLOnH4Yw6gVOTuFJZFM9tXXiKcbI4P2j9iGyXqHyIFjwEITg%3D%3D	https://www.docker.com/	docker	\N		backend
72	nestjs	https://storage.googleapis.com/cv-cherkas-db.appspot.com/technologies/backend/nestjs.svg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=d2yWi611IuWndUaWstueIsrGJj8eGCB31en6Hf%2Fht0y%2Fc5QcsAGxL%2FQInfCpSwKckG7KGxKpNW6AN8LQYvgiWqs0GE2DsjrooFhCmIbhoycwRRI8%2Be5ovgb7g%2FqMmPhDKJgsb6VkezW8YiPsAjS3wMPpoNMeAkJYOOVoNWm%2F8%2Bdz5coMlZdnIKafMtvpWfHRspHbGlbXpNFSzi1CZRpGiEMd0cOlXyTSpOqEeK8QcreUhYEpRIEteXCr3zKLr2d9aDJPxsW2LvTir72ZJ7HvnEDeQ3Q9r%2B8iYT9PQYfWFyB85XZZioEY%2FCtjnDTo5pu0jxROkvUWSvuAC2lCszO3lg%3D%3D	https://nestjs.com/	nest js	\N		backend
73	kubernates	https://storage.googleapis.com/cv-cherkas-db.appspot.com/technologies/backend/kubernates.svg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=ekbU%2BuC0BgOaiEdOe69rEe6S35hX2jg1h%2BhY7qWcQUfxUs0Xtb0U2ENsfY0BSOOkp4GdMDurdyZwMuycv7Xp6T4vvlttVipuc7ubJ7KhP1heTLkAt%2B0cYraAjX3fL1nK2JIswY%2Boh7ggtg1qUiu1X6sqw0nrdPSBn3r5WfbrOS5IyN03zoPhhMDKa%2BotMiPdrsA9SkF%2F4GYd%2BJXBxo%2FX11V%2FCVCKtARQbovFC2cJEdQwMz8Oq9cIHvL9L1QWSUgS1sAsCFj%2BhHqNrbrbKM6cLgtC2%2BeGemxQTklbpSGVqymDAmUYznP2fKVxMKVOZ0oOO4V02XGBExGC1uUUXt85qw%3D%3D	https://kubernetes.io/	kubernates	\N		backend
74	nodejs	https://storage.googleapis.com/cv-cherkas-db.appspot.com/technologies/backend/nodejs.svg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=DtnuQWg4QqmE2SJD8%2BBgQBGH5rZ9qCc56H%2BwMTXsEVVIsYTnyaC2tBdLtFw3UHWG2ttfu0ukGLHtjzsyZQo5WgNeTVsl7qwdVjfQ7X35ooLOXFDNhYarGtyiwI4bZ4cS70bbK4elJR87q3CdLO89hUvErgkux1qou1E3c5qbmpGk3Kx9m3rVhFGerGCyVULigKyD8bC7S7Y4wnvWl3rqYtija4G558n%2F4E1UHmct21vjkcQ7remlmpSMRtbEOsZLtuic44wdWzU1JmwSV%2FOwwE6cUCzy1C7pcU5%2FJwZVOySS5%2Ftj8YTW40i7q7takcIA8lThRvXsQf0cKXFwjuJk4w%3D%3D	https://nodejs.org/en/	node js	\N		backend
75	angular.svg	https://storage.googleapis.com/cv-cherkas-db.appspot.com/technologies/frontend/angular.svg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=irjoYFCEbb6mr6CZs4gZ1YdJTYFNZS35%2FHjBJJ23Ab8f9BvEDnRSN3jTM9r7mv2%2BjfUlQkfVFc9l0S%2BQhIoC3XwWmnCMPgY5Lnr7eeONE6slfqqhpfGnp2Vxvi6VP73rRRyXCEAUrjZ2Wuz0zyidBsP0wGd%2Fg9ooAQuFUZq%2BaFIGUqm0ENEKSN8riAixvMk7RprjF6GMEfLV3%2BmtDE3N23%2B8D%2Fv88qFIpgYGW34s8N4FhklTj927XEzUW%2FsyZfBl9muwC8efjzGYtga4PenXDeJ2vdMPY1PqXOXue1XckEGhD1gJfVLKt4FKowxMVKlLgNzVeZ%2BPObgJhUKY7YWZdQ%3D%3D	https://angular.io/	angular	\N		frontend
76	ngrx	https://storage.googleapis.com/cv-cherkas-db.appspot.com/technologies/frontend/ngrx.svg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=lzU9cfvXRIIn%2BBUcMk29jsMWqUcChXh6bjnrNTBrAQ92KKshpad91G3%2F0q8VymHZTRRotC%2FdTYvGKwQD%2FEy0Pcncg5h5J8Ap5l9VfAzDrXaoxDC%2BHjVyFxj8jFrYPGi3SJ54mcCcx7rfHtDUPs1dvi8DIP8FUrR7DjVfAUnxTjv9xjqVyPXQ8wf2zv0IGEmHwOYqC0x021ang11%2BZU08sx2Kna8Oa3QgSGZx96oyxWfYbI7FpvfjLjzmWgkI12MyrQrH7QWE30KHmInQabvjREgnHV8uvA8hwPDEFvxqCvOZSIXLQJhp7sMLxrdAC7r5ttLKEcbjp0Eu%2BOklBXsw1w%3D%3D	https://ngrx.io/	NgRX	\N		frontend
77	angular-material	https://storage.googleapis.com/cv-cherkas-db.appspot.com/technologies/frontend/angular-material.svg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=cCNKwehV6yCwtqL8ad93wbpPHJvIVEDJjL736LRkYVXnjctAq%2BBt%2BJjN6N9naJj8iWi%2FCT1xzwO0TXIupbmk6aR%2FRDzkRpV9H2c%2BHlSWfhyPU9fjWF9wJirv%2BgNPGOQvjas%2B4nHDpG9eEJbSB7cjZU099UwNhBcCILAQzqR3tNN4%2BETiXGEKUZjBPPwK%2FC5zXwTGlFLHBnqCSclwUftQocpE425%2F2NgvV%2BcrT4fOjn5Q8NZVIzInYGxqd7GRkln%2FPF%2FH63xWWFbptpD49UuG%2FWLlxjxzWCbkoUEtsQiek9NINVT96zIZxjqEgyJmvMTbj65sEPdMj3p7DRLQoj1JgQ%3D%3D	https://material.angular.io/	angular material	\N		frontend
78	angular_js	https://storage.googleapis.com/cv-cherkas-db.appspot.com/technologies/frontend/angular_js.svg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=itOH%2F88NsZP0m5CruMdaRhskfNG1qguz15MyAIFOubpihhn65kzRFKv%2FKOZzFkc63X8EMpMsx1ZNvEVPfTGfsoreUuVOREuRcjzJMH3pHVZWBvbioAVAPSdhehz9Vinjop3qVeSP4BUhPGLowvltiyjM2uWoq5ekan9PtNc%2FtkM3ZlloVFAAAwndQIs%2FDygAJm5CS9NbjEIO075cLOBD9ZLQDJ8Lqa5C%2BfqTP9gMNiVR5vK0PWDpUzMX29Q7Q1j6PpRdm%2BBDk4HDVPa7IB4oEZrjDQQfCo31UpOH0F%2Fi3tA57Xl4tlnA30sNFSm%2BJlMz8uGSkXn%2BCvZlJdHy61uURQ%3D%3D	https://angularjs.org/	Angular JS	\N		frontend
79	css	https://storage.googleapis.com/cv-cherkas-db.appspot.com/technologies/frontend/css.svg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=ApzNSzqKUdRoeJgEAsuRK5BlEVg1ugxLnrozBcKY%2BFmX7ZFQiC79ogj5yU%2F3hVssL1KaHBHlxc%2BhRGU8YNFtJOh82m0V2CY0EmHR05rASj6rBns9083sgcVBsjbjpb%2F%2F72m017d2XzGmtJ1KxTTtxz46Ih1R7UoenHzOMIXECc7s0RL1qsWFbQ%2FLdNa%2BQcaRRCXgZUb0r3FAnmzKXp3p83jsvhW2Hg%2B4qEaLP5d4UbS7n7XAmXEdOWoOjQGlXF0u8lR6peMfKTYm8E%2Bi64qcvAj5iP5BSqzw1%2FDCqvHfM8L392otXHVl%2F8xkS7IFT3I5HHptat5R9vffzJ6rWTV06w%3D%3D	https://developer.mozilla.org/ru/docs/Learn/Getting_started_with_the_web/CSS_basics	css	\N		frontend
80	angular-pwa	https://storage.googleapis.com/cv-cherkas-db.appspot.com/technologies/frontend/angular-pwa.svg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=A6tUVL9Yth8t45%2Fj0Yl%2BxR4YSzC6YRlWnixDBms7lp0%2BfFhaZE45W7VTkIqyyEy06J46dnW4mV1X%2FA6l2sbbt%2B1yMWo8NT0d7jr%2BLrbyYkUL63m0uLGlb0WXWgvdCZps8eVjnnQWCPizdFvM3AWuelcgNAQ7Fke9EF%2FwjSc1stUL4GqYiW9v4%2FvJH%2Fu%2Bj6glnsFTuG%2Bk6WQbx7HDIQZ5HHUBjLmNgVEeAQItsOkElM8QCFFALUgf4e3yFODR8U8HepUGEYfrhQizufDh7IgnP58qlfOi4knBfjV3O1fjq2EkLWeZIAPim32%2BI6Gi7fX2Ya%2BQRR%2B0HNOrDwQ%2FH7ubMA%3D%3D	https://angular.io/guide/service-worker-getting-started	angular pwa	\N		frontend
81	coreui	https://storage.googleapis.com/cv-cherkas-db.appspot.com/technologies/frontend/coreui.svg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=w9cTiL%2B94kRfIjJp64Viq7Dlye2URw9nI%2FkDBeook2AYSSC0Oa1R6821PKzTZjKx1EMKe3th3td9d6vWvnHQwMdSolgPbRm%2FnuZY%2FVHzEk%2FmF5EQ4VjdNLh05BamJNWpgz8YDBIleF39Y%2BPnefomGET6sLg9UkY1scvao1JnL%2Bmdzajf6BKl5cVRC4HRZRSbmNHEO9tFeYmrSqz4FuRbskUWkwpw0ACJtmtpJ3NfeGAosBXNJgFUlkJ%2BEa3ClNSEWWbCy206cNaksNf3cnw7oD6fJba%2BBHMam0FEyEapp8LOJFDdOMjsZA%2BHOYPqasRWYCMz0WVSvt0sryRWvIGHfg%3D%3D	https://coreui.io/	CoreUI	\N		frontend
82	angular_17	https://storage.googleapis.com/cv-cherkas-db.appspot.com/technologies/frontend/angular_17.svg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=eQ%2F5XfXFyh5UetlYN7PXJ%2FyZSfdHFXOm%2F7%2FAeUnAFhvx%2FMX%2F3iWggt1gQxxhErg3ynxe2Hx%2Ftn1iHYejc%2FbZ%2B5Lv0usA3p0kGNti34LuEbvJF6VzUhjDOh2waIR1KwGMCStvmmr4%2Fve8i2Uz1hmBuQOPdRBlw1kHlbeCClbGYN%2FYWeOGF%2BHNQ9bYlnmrWyId77G5K4jmS9tbRbqjhxdBVqclVDrikXa4kqim4nJLquoEx8uMD0UOTIs8q%2FNvGw5k20iRE%2FCrM9GURp0QJ4N0B0aoJTxe9Ls52D7ZsQ6fbQ07gXFsfn8XRKwNg6mHwgyfGXwkeYDS8KEy3KYUvoC3Yw%3D%3D	https://angular.dev/	Angular 17	\N		frontend
83	java-script	https://storage.googleapis.com/cv-cherkas-db.appspot.com/technologies/frontend/java-script.svg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=obqA8iynAwwztazdKDSie99Lrs3%2FcjJ6Bp%2FoJajdzycQ8EuF0miWRFKSOZPtBGFffI2xvfyla%2FA6j%2BLiCtdMQ5a2lSJMf1tcxMc5MYykTOsacIVOQmniExcnmSLByAEalYnHYl43zr5IPX5NYWMc0OgpD3X5cceQF%2FKYyhWswkaoS7di%2FOfOvx26b9eN3QrUjBNJNcMEg28TKbwreEt1iYJtf8jfhvDMXkezlFUMq7oL437mVuCekYCC%2FbMIhLUs%2FZc8oaa6TjYTWSSkkl9j27ptUEmJxghrej6Hj9T50Zk4ArHwlz6lG4gddokuxmv%2F%2FnHwZNm8l8VEa08aJ%2FT7dA%3D%3D	https://learn.javascript.ru/	java-script	\N		frontend
84	type-script	https://storage.googleapis.com/cv-cherkas-db.appspot.com/technologies/frontend/type-script.svg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=r3T5duAu4xJqPQgC7Ng%2F3dg4F3NrgbpcUFnn8xiHNWkI2O9fbnLC%2FsbkIsM5u36vZuwgK1TaPCR470golSGZEdpXLLqh%2Fh9hsAjfTrpJWBHo30sXzO6JfKQ%2BYJ9MWt0kIF%2F19hz3v6L2ZYUmzdyNePX2jJTPlWFkOKSpACH1L7dVhwtc6dp8%2FS9nKb%2BIT1jMFLxZWXBJjOsrbhtdsrXgm9UE99Kv0tL2f7ZHxlrX2LrGfwfKnmQomhJGLkVV8k2X5FOY3%2FbXrHS2RzHczzVIDNB68bV9WGfut1kvZrT65WwBQ8cjGYn9kAlc649WOB8gpWuL0qNqAjL7Ivm8lIxhkg%3D%3D	https://www.typescriptlang.org/	type-script	\N		frontend
85	rxjs	https://storage.googleapis.com/cv-cherkas-db.appspot.com/technologies/frontend/rxjs.svg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=OhPlhIdrtNaLR8vkHv7Dta0q57P2dETuSQaZFZJf%2BUEB5K%2FfiUO8oBtEvsNRs95cs%2Byl5H9zzgzCJDnjBAqNtnOqYnQORfRHnbQjdI8AFH1CUcRWr2N7djDgYbJE8PF4YYx8P0E%2BQRmt%2FuX2%2FiJRSQn6kOZ1DbqYqy84w%2BSMOL17ZCn6cCXEcH9ZXBm%2FsxbNniTTOh%2BpECzWZgUviuN30GVXMU04BIvuFSEenPd0S7WZTUSChdSQhBl24zsGZEqnHUJxGvlHf%2FoLSfwpQeasp6QRTRUyfkPspgX09LiN%2FEnFGV4Z1eyaRby82h0k4MQ2AZFUAi1%2BHK8aWT79mfcRGQ%3D%3D	https://www.chartjs.org/	RxJs	\N		frontend
86	html	https://storage.googleapis.com/cv-cherkas-db.appspot.com/technologies/frontend/html.svg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=YY0pAzqw1rJpG9yi87fDoRvXL%2B8BEKguk2orqcYVnHvkyedCa1tDLH6ccFvVcpqmCEcDbZzWtO6KyXmWNzEj7xXsxSLv2fLcVwWvy4qt2Q0%2BdpZLNQGpJ458fLd5MGBDbfiENju%2FY1vBwKbPDoQ0ytF2OJLiETX5%2FDgEIgMl0D6DQhp%2FwVb3xE1iU36LxzmasLXXeYwhqUd7pGdcHtfiCr8WzPfZO7fv7dbN9f3%2BX7tfcPxLwdbpiywUjh%2BclUIPH8z0FvIvpPFQyZF3laNRTBl0u7aX5NLqgSbDiC8sVPYtz6TT6zQamnSIFdquQWf%2F3vx9Dts2fgKQt5nt%2FamoKA%3D%3D	https://developer.mozilla.org/ru/docs/Learn/Getting_started_with_the_web/HTML_basics	html	\N		frontend
87	firebase.svg	https://storage.googleapis.com/cv-cherkas-db.appspot.com/technologies/other/firebase.svg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=FORid4AP8QYBZ67tMXaBFwcYe7gX%2B4Ke78SyVCQwsggyRZo8347hUIBikhBkQLRDl6XBOYIQxSCOpkmjNvzUs%2FXUK5NIt6tpJJ3tR0cb7Bab8w%2FQuaOzbjpO0yU4KRGWxT4OlmDAMRSxQsKyoCxFvgUoT8oRKo%2FNCLHwhnTJd7C4cvtA4E%2Fisz3nMQp%2B6IJhB9aS1epYRBpUVwKOLbIjQ41bq4HpSaQWg0t1t%2FoFdrVHImC9dnHXFMElUM0Syam4%2B2dq6OLHdZz3jOFTkP13gc6Yp3WKnqLwZffVWhnNO7mgWSoJ43EX1yB%2BnsWvDcZBKTL3ycz7a1FPSa5sf2qglg%3D%3D	https://console.firebase.google.com/	firebase	\N		other
88	photoshop	https://storage.googleapis.com/cv-cherkas-db.appspot.com/technologies/other/photoshop.svg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=WtIfS1B9pmS0Oi2pW%2BPqe2B0%2BasIfwqvat4PkHREVIdd2VlBpFdyejQX3oigBV69AfvLQJkLWcCYYS1UKHa3lr4ITr8LKk01s75gh07mdSw0CpkOMK7DF2XRvycrD%2F5jpyDAM6mTUHtPZ8xw007CFj6GhP6GF4dMDmeO0kk91MV3nkjpREd47FPM7pCgXjQQsNoldpiKBAoePeWP8faJbXFgw0L3YAI%2FoDVuCJCzUwxXUPstuSZTDLfjN%2B3bcPLAboAc2EfK9MZFHTXRfPKyQPA7cyjx%2BUcSahaB2tsTOoWuHA%2BuF6Evo7nzEgB62SNn1TNHZ2mjJOz6HBUtg%2Bb2kw%3D%3D	https://www.adobe.com/cis_ru/products/photoshop.html	photoshop	\N		other
89	jira	https://storage.googleapis.com/cv-cherkas-db.appspot.com/technologies/other/jira.svg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=LCC7ZFJ5wX6dpF2Pg7Bv9mqHG%2B52urE9hTN2UhHCfiZxD3iKrbcn7SQgDTHsYwAJmDTvo%2BVszrZlxxigYBqfH3IzISdA5rBPTHCO4V2Lzlj7rlhydxe9XLbjykqGeBlX7lZYrEuf8G7tJbnDEwGqevUFef8OgTVcOMDgxPvZ4HGJkiW%2FMHtWOtHjcc%2FE8mVcyLU0qZUaAIdKlX2TjZeU3zHKZg3riCeaea1eQzAJjBlMgb1ScAL1%2BFMP4rQ9OcfgPWCCniAWkypLh7gC2%2Bn0sKCwVlliqOhYsua94YVVW8A%2Fi1v1AHKOrwLl%2BlJDuu7qjlUhal4PEPQ0OYDbpj9Hhw%3D%3D	https://www.atlassian.com/ru/software/jira	jira	\N		other
90	figma	https://storage.googleapis.com/cv-cherkas-db.appspot.com/technologies/other/figma.svg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=x36rKhLqwPNp%2BtsSIbvW%2B34qcBmo4gTejygfjT5pGvOPwEcgnopXGPwdk3%2B%2BXI%2FrXxQpv7xBL8ND9fG%2B2rdJvOH4vcZZTjUT%2BKlFuRGwV7mMjiNSZwOJYigKSOXb9y1sxCQeUk4U97ob3jeumv%2FBGi3S9auADUgjTv3cHkUlsCVk%2Bmp3GZuSESKODXI897dBjZpMvhrxtrO1kA%2Bjh5jZh29h8IFsb7NzyxacZ43PdAr9LTg8%2F0UWxhGilwgcS0z5prQovEXn%2BEyJEy2p5hJ1sVKh7yKG2rJsj5K6tBHPnurlCG0J0R9TU%2BqhgCAuN1JJfeUdZyv0IQZComI60hPoZA%3D%3D	https://help.figma.com/hc/en-us/articles/360040028114-Export-from-Figma	figma	\N		other
91	atlasian	https://storage.googleapis.com/cv-cherkas-db.appspot.com/technologies/other/atlasian.svg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=l%2FbDk3eB9CdaXnJJt1Yp%2BhfYFo45L0lL3f1H6iUObfNHWILtkJf%2FG7iPVExGk8rlHkPSgR0eoQdVCWBQdgzOvd9%2FwFzpcad3WcXyYU7TJHIL3ButV5YJ0jCv3jHfjoFyVxGQz76DfrwV%2ByK4VtUsaDzLNCAQqB925Bm9HqDDsQlt8asu%2B9du%2BBbcw6%2Fc%2FG2BnKG3ZQP3ot2Y9z%2Fgy6G8mDJgvCadermuHDYV%2BCNdLqwcNKe%2FQbb%2BY%2FgYmNCCvJ3zmwKxB8B%2BQhxKk%2F%2Ft%2BBGp%2BZLLPpfF%2BUNr7JaouCyLdtApf5XIlBmQrO9piUdIxS2mDGai0vcxBsoZWPHAgLA0ww%3D%3D	https://www.atlassian.com/?&aceid=&adposition=&adgroup=99178942974&campaign=9869841980&creative=431976236588&device=c&keyword=atlassian&matchtype=e&network=g&placement=&ds_kids=p53277672706&ds_e=GOOGLE&ds_eid=700000001530700&ds_e1=GOOGLE&utm_medium=paid-search&gclid=CjwKCAjw3POhBhBQEiwAqTCuBreyq6smj0TRYrk1AuFUehCsbnVfgnE799DYSdknNM7szXA3uEX7IxoCr60QAvD_BwE&gclsrc=aw.ds	atlassian	\N		other
92	confluence	https://storage.googleapis.com/cv-cherkas-db.appspot.com/technologies/other/confluence.svg?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=WeF9UDy6Xnt%2FngBk7Z%2FaKZA9Se7fm0XNDvlIvBolD9J6Ye0ybVhbSB0RvDX59uQ39qUXp05SFD%2BaV94puzzTMw7xe%2BeBzzKoKsWwqE3taheMPQinSsDRlaVeeMnAMNovDPZSUFckT%2Boi0WBPAdpyTtdogSKhA6COwBWxu9gqfkWIks0CqebwPoIWfD5lsbKv7ZL%2FZrlB7gcKzQxYLO52DzZdPwvlSajP%2FYeb0irqfu%2FyGWvuIMKcKpP%2BnoCssa%2BWRHcC6%2BC85Ns6gGBUWKqUNXNCKPaSGyqG%2F%2FHRwWeJisDY0CKhvZCX4vPzP9CO8AsYXp8ka52FE5zj0yjR52N9wQ%3D%3D	https://www.atlassian.com/software/confluence	confluence	\N		other
\.


--
-- Data for Name: themeless_pictures; Type: TABLE DATA; Schema: public; Owner: jv13
--

COPY public.themeless_pictures (id, name, "darkModeIconPath", "whiteModeIconPath", "imgSrc", alt) FROM stdin;
10	close		/assets/images/icons/white-mode/close.svg		close.svg
11	moon		/assets/images/icons/white-mode/moon.svg		moon.svg
12	sun	/assets/images/icons/dark-mode/sun.svg			sun.svg
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: jv13
--

COPY public.users (uid, email, "displayName", "photoURL", "createdAt", "lastLoginAt", password, "isAdmin") FROM stdin;
HweBwEk8a8VTx04ihxe0xwnKYJ82	cherkas.ivan13@gmail.com	Cherkas Ivan				\N	f
\.


--
-- Data for Name: work_experience; Type: TABLE DATA; Schema: public; Owner: jv13
--

COPY public.work_experience (id, "logoPath", alt, "iconPath", company, "from", "to", place, link, specialization, "workTime", "imgName", images, type) FROM stdin;
16	/assets/images/images/companies-logo/neatsoft.png	neatsoft.png	https://storage.googleapis.com/cv-cherkas-db.appspot.com/companies-logo/neatsoft.png?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=dwUIwq%2FML%2FwYxzsmUyz1jR1iq2EEvrOsVVaqmu7RaTzZQlNRf8yJglS1RXNQwoBj1zEEN8yKRBTopRoWmiDolH2554N0tHIskLzH76s55oveh2vccLbpOVamrufMGzGx2kIMcQwT%2F58NQk%2B%2BL023l38Z%2FUb2sk5%2FnoqqGzEgA%2Bm0%2FZcaCnBacTdsNanwGDzMd6f24gpUW6r6nUHM0utORXcGChnLzMgD3fdaXEkpOyyTWpN9VvXgr43ePcsm39oOsVpKFVgHohPQklZ04ir4UVelCxqbodL4takENUq6uSyojmtQ0D%2FxHV7voO7SPE6RSR9teFRJ4%2Fi70jREa%2Bot7w%3D%3D	NeatSoft	10-10-2023	Present time	Минск, Республика Беларусь	https://neatsoft.io/	Neatsoft		default-image.jpg		work
17	/assets/images/companies-logo/intexsoft.png	intexsoft.png	https://storage.googleapis.com/cv-cherkas-db.appspot.com/companies-logo/intexsoft.png?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=HVLtp48JrGgbGd%2BsunTUkK9CvSaHt2JZfPGAP%2Bc%2FnXz4pMP8O1x90A7OOr3SPquYEUHfsI68Jm1peDcD2dgGByP8kZxoBik2C9InWppEFtoMVmxbexjIrjIAGsxN3W0ff0U2%2BaPlgEKAED6Ij9G4PCh%2B%2FPbvIdsqO%2BiVJU2i17Aqa67SzfEt3kK657D42bzlz7ZPerJwHBYRXkTiWhCjlTW%2F5nBRYo5gCgD2Mjl0ra%2FrMaCUEc8YFXW%2Fju9bRLCun1vg9W%2B3xnHn0Ke6i9B%2FLqQCr6Kf2eGqL6lFSUZyEj93vkExM6A5QkoXOT8yzhm%2Ff5E0mxt3c%2BEUHRxr%2BBenVg%3D%3D	IntexSoft	24-12-2022	29-09-2023	Минск, Республика Беларусь	https://www.intexsoft.by/	Neatsoft		default-image.jpg		work
18	/assets/images/companies-logo/fls.png	fls.png	https://storage.googleapis.com/cv-cherkas-db.appspot.com/companies-logo/fls.png?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=pc95zoqHJH1PtDK6QwYYnecjXFgMJwb8%2FwJ%2BUIdD7YEbV2WkDDaIeMhIbF0rRfY0xjucShIJK8aBS2ixc0VmyHAQ3VJwf1A1gNna42XwNAJiWPHef0JBKit6Ucet%2FgNuGXeoku4rLr8FWxalpRyb5wSCreGQtVBHiZiurZLJdJ%2BolyouH6YsDT2kX5jrOETQlFLq3KTlm6GLqK%2Fh5b55UQo2DBtw0MH7A937TgveyLLJEczuAgEpy5WSUaG3YAgsztZ%2B4UF9V8DMWlESbBaAHa0s5RprKa2Ilxe9cmRBku1vAZGXBOfNP8KqgSXnm555xOOAtv1I6ekMdLYCPQ7pdw%3D%3D	FreshLimeSoft	01-08-2021	22-12-2022	Минск, Республика Беларусь	https://www.freshlimesoft.com/	Neatsoft		default-image.jpg		work
19	/assets/images/companies-logo/exadel.png	exadel.png	https://storage.googleapis.com/cv-cherkas-db.appspot.com/companies-logo/exadel.png?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=XMN2l%2FiYYuK9dUDt1nLwN2SrNrXoozZ2GOg3vp4Cg2BYhQINu5ebIoWm9c%2BWywHMIfdlSgYkP2a2ZR8P%2BKoUXxcI7fn1T4pStH5wlBCu4N%2FHWZkmKuDPfj8KYf6upkdveZlIYAKOMlOMx2GEruFMjC3IctdW1zzXnFiHfLcwcnkIMugFpAqdw1TPsyERDHphPI9vJj7LZ062gZhmxb86GGYMVvBZ1aa1NXXsQewdCdeGWZ760NvGWWHcULXVkrtP9DXftkS1MnVegZVzZfHRLLynus%2Bo9D0gU43yip9NNFbOcq5yXDspbtD9UDWHVCsKNJDidvb%2FqafTcSYW6ORuQg%3D%3D	Exadel	01-01-2021	01-04-2021	Минск, Республика Беларусь	https://exadel.com/	Neatsoft		default-image.jpg		work
20	/assets/images/companies-logo/tms.png	tms.png	https://storage.googleapis.com/cv-cherkas-db.appspot.com/companies-logo/tms.png?GoogleAccessId=firebase-adminsdk-lvu9t%40cv-cherkas-db.iam.gserviceaccount.com&Expires=16730312400&Signature=J1DZAg3me%2FaHFo4VTePs%2FX7Sr1sujUaf799tSPRaK8qWrjYy455Te1WZd9F7zXM0d2sezSJ6VzYYPmw8RUa37nyLISLzxpqseVbd4oneqaYyq6DMG4a9MSZX6YNyVdIa7ZQhs%2BjX19y8nGfeMkUn%2FuLzqLwFy2kqsgiZmrAswxaD7c5w205DGAb8n1kShb3jVDkqZS8kPU%2FH4la9bEG%2FkbS%2FartMOEoeQh9nQ2iPt4N8HXAcE%2BHwiLwWqUwW2v2wmNPxONON60z9soyISwrxZ5R25lH%2FG5KNAQSIUSMXrIVHXmiKMBFqoHHK99Mfw2%2B6o4lhZg8JzExiQCsoEwQGZg%3D%3D	TeachMeSkills	01-10-2020	01-08-2021	Минск, Республика Беларусь	https://teachmeskills.by/	Neatsoft		default-image.jpg		work
\.


--
-- Name: auth_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jv13
--

SELECT pg_catalog.setval('public.auth_sessions_id_seq', 1, false);


--
-- Name: education_experience_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jv13
--

SELECT pg_catalog.setval('public.education_experience_id_seq', 36, true);


--
-- Name: experience_aside_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jv13
--

SELECT pg_catalog.setval('public.experience_aside_id_seq', 8, true);


--
-- Name: hard_skills_nav_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jv13
--

SELECT pg_catalog.setval('public.hard_skills_nav_id_seq', 10, true);


--
-- Name: main_page_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jv13
--

SELECT pg_catalog.setval('public.main_page_info_id_seq', 4, true);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jv13
--

SELECT pg_catalog.setval('public.migrations_id_seq', 1, false);


--
-- Name: navigation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jv13
--

SELECT pg_catalog.setval('public.navigation_id_seq', 20, true);


--
-- Name: persons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jv13
--

SELECT pg_catalog.setval('public.persons_id_seq', 12, true);


--
-- Name: project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jv13
--

SELECT pg_catalog.setval('public.project_id_seq', 12, true);


--
-- Name: repositories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jv13
--

SELECT pg_catalog.setval('public.repositories_id_seq', 92, true);


--
-- Name: social_media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jv13
--

SELECT pg_catalog.setval('public.social_media_id_seq', 29, true);


--
-- Name: technologies_aside_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jv13
--

SELECT pg_catalog.setval('public.technologies_aside_id_seq', 8, true);


--
-- Name: technology_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jv13
--

SELECT pg_catalog.setval('public.technology_id_seq', 92, true);


--
-- Name: themeless_pictures_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jv13
--

SELECT pg_catalog.setval('public.themeless_pictures_id_seq', 12, true);


--
-- Name: work_experience_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jv13
--

SELECT pg_catalog.setval('public.work_experience_id_seq', 20, true);


--
-- Name: hard_skills_nav PK_0a8fec56175ef1a2d12073759db; Type: CONSTRAINT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.hard_skills_nav
    ADD CONSTRAINT "PK_0a8fec56175ef1a2d12073759db" PRIMARY KEY (id);


--
-- Name: project PK_4d68b1358bb5b766d3e78f32f57; Type: CONSTRAINT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY (id);


--
-- Name: social_media PK_54ac0fd97432069e7c9ab567f8b; Type: CONSTRAINT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.social_media
    ADD CONSTRAINT "PK_54ac0fd97432069e7c9ab567f8b" PRIMARY KEY (id);


--
-- Name: auth_sessions PK_641507381f32580e8479efc36cd; Type: CONSTRAINT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.auth_sessions
    ADD CONSTRAINT "PK_641507381f32580e8479efc36cd" PRIMARY KEY (id);


--
-- Name: education_experience PK_6889e9433d32cf1cac6e88f5c01; Type: CONSTRAINT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.education_experience
    ADD CONSTRAINT "PK_6889e9433d32cf1cac6e88f5c01" PRIMARY KEY (id);


--
-- Name: users PK_6e20ce1edf0678a09f1963f9587; Type: CONSTRAINT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_6e20ce1edf0678a09f1963f9587" PRIMARY KEY (uid);


--
-- Name: persons PK_74278d8812a049233ce41440ac7; Type: CONSTRAINT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.persons
    ADD CONSTRAINT "PK_74278d8812a049233ce41440ac7" PRIMARY KEY (id);


--
-- Name: technology PK_89f217a9ebf9b4bc1a0d74883ec; Type: CONSTRAINT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.technology
    ADD CONSTRAINT "PK_89f217a9ebf9b4bc1a0d74883ec" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: navigation PK_a7c90881db5205ad8d6b86ffef7; Type: CONSTRAINT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.navigation
    ADD CONSTRAINT "PK_a7c90881db5205ad8d6b86ffef7" PRIMARY KEY (id);


--
-- Name: themeless_pictures PK_b05c201c7e20aacb251103731a2; Type: CONSTRAINT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.themeless_pictures
    ADD CONSTRAINT "PK_b05c201c7e20aacb251103731a2" PRIMARY KEY (id);


--
-- Name: technologies_aside PK_bf7fd030ed94130719987296eed; Type: CONSTRAINT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.technologies_aside
    ADD CONSTRAINT "PK_bf7fd030ed94130719987296eed" PRIMARY KEY (id);


--
-- Name: main_page_info PK_c70a0dcb756e5cda8564794a073; Type: CONSTRAINT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.main_page_info
    ADD CONSTRAINT "PK_c70a0dcb756e5cda8564794a073" PRIMARY KEY (id);


--
-- Name: work_experience PK_d4bef63ad6da7ec327515c121bd; Type: CONSTRAINT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.work_experience
    ADD CONSTRAINT "PK_d4bef63ad6da7ec327515c121bd" PRIMARY KEY (id);


--
-- Name: experience_aside PK_d690ce5dd020fe9903ecee9b035; Type: CONSTRAINT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.experience_aside
    ADD CONSTRAINT "PK_d690ce5dd020fe9903ecee9b035" PRIMARY KEY (id);


--
-- Name: repositories PK_ef0c358c04b4f4d29b8ca68ddff; Type: CONSTRAINT; Schema: public; Owner: jv13
--

ALTER TABLE ONLY public.repositories
    ADD CONSTRAINT "PK_ef0c358c04b4f4d29b8ca68ddff" PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict ktW7gpE0nvF7I3LCO41WyHzvEeN1aSvzzARQq88nwzVzuqq7MmZx7lhxhYlEol0

