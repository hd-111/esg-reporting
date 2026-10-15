package com.esg.esg_reporting.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.esg.esg_reporting.entity.ReportingOrganization;

public interface ReportingOrganizationRepository extends JpaRepository<ReportingOrganization, Long> {

}
