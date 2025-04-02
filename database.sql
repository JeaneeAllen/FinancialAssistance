CREATE TABLE applicant_information (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    middle_initial CHAR(1),
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other', 'Prefer not to say')),
    marital_status VARCHAR(20),
    street_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state VARCHAR(2) NOT NULL CHECK (LENGTH(state) = 2),
    zip_code VARCHAR(5) NOT NULL,
    us_citizen BOOLEAN NOT NULL,
    ssn VARCHAR(11) UNIQUE NOT NULL CHECK (ssn ~ '^\d{3}-\d{2}-\d{4}$'),
    home_phone VARCHAR(15),
    other_phone VARCHAR(15)
);


CREATE TABLE dependent_information (
    id SERIAL PRIMARY KEY,
    applicant_id INT NOT NULL,
    lives_with_applicant BOOLEAN,
    d_first_name TEXT NOT NULL,
    d_middle_initial CHAR(1),
    d_last_name TEXT NOT NULL,
    d_date_of_birth DATE NOT NULL,
    d_relationship VARCHAR(50) CHECK (d_relationship IN ('Spouse', 'Child', 'Parent', 'Sibling', 'Other')),
    d_us_citizen BOOLEAN NOT NULL,
    d_immigration TEXT,
    d_sponsor_name TEXT,
    FOREIGN KEY (applicant_id) REFERENCES applicant_information(id) ON DELETE CASCADE
);


CREATE TABLE insurance_coverage (
    id SERIAL PRIMARY KEY,
    applicant_id INT NOT NULL,
    has_medicare BOOLEAN NOT NULL DEFAULT FALSE,
    medicare_part_a BOOLEAN DEFAULT FALSE,
    medicare_part_b BOOLEAN DEFAULT FALSE,
    spouse_has_medicare BOOLEAN DEFAULT FALSE,
    spouse_medicare_part_a BOOLEAN DEFAULT FALSE,
    spouse_medicare_part_b BOOLEAN DEFAULT FALSE,
    current_insurance VARCHAR(255),
    no_insurance_explanation TEXT CHECK (no_insurance_explanation IS NOT NULL OR current_insurance IS NOT NULL),
    insurance_card_copy BYTEA,
    FOREIGN KEY (applicant_id) REFERENCES applicant_information(id) ON DELETE CASCADE
);


CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    applicant_id INT NOT NULL,
    statement_date VARCHAR(7) NOT NULL, -- MM/YYYY format
    asset_owners_name VARCHAR(255) NOT NULL,
    type_of_asset VARCHAR(255) CHECK (type_of_asset IN ('Checking', 'Savings', 'Stocks', 'Bonds', 'Certificate of Deposit', 'Money Market')),
    name_financial_institution TEXT NOT NULL,
    FOREIGN KEY (applicant_id) REFERENCES applicant_information(id) ON DELETE CASCADE
);


CREATE TABLE employment_information (
    id SERIAL PRIMARY KEY,
    applicant_id INT NOT NULL,
    worker_name VARCHAR(255) NOT NULL,
    employer_name VARCHAR(255),
    hourly_wage DECIMAL(10,2) CHECK (hourly_wage >= 0),
    hours_per_week DECIMAL(5,2) CHECK (hours_per_week >= 0 AND hours_per_week <= 168),
    tips DECIMAL(10,2) CHECK (tips >= 0),
    employment_type VARCHAR(20) CHECK (employment_type IN ('Employed', 'Self-Employed')),
    business_name VARCHAR(255), -- Only applicable if self-employed
    start_date DATE, -- Only for self-employed
    business_income DECIMAL(10,2), -- Only for self-employed
    FOREIGN KEY (applicant_id) REFERENCES applicant_information(id) ON DELETE CASCADE
);


CREATE TABLE other_income_sources (
    id SERIAL PRIMARY KEY,
    applicant_id INT NOT NULL,
    income_recipient_name VARCHAR(255) NOT NULL,
    type_of_income VARCHAR(255) CHECK (type_of_income IN ('Social Security', 'SSI', 'Unemployment', 'Rental Income', 'Pension', 'Child Support', 'Public Assistance', 'Other')),
    amount DECIMAL(10,2) CHECK (amount >= 0),
    frequency VARCHAR(50) CHECK (frequency IN ('Weekly', 'Bi-Weekly', 'Monthly', 'Annually')),
    FOREIGN KEY (applicant_id) REFERENCES applicant_information(id) ON DELETE CASCADE
);
