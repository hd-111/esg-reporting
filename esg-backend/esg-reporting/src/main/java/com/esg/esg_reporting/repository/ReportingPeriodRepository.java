package com.esg.esg_reporting.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.esg.esg_reporting.entity.ReportingPeriod;

public interface ReportingPeriodRepository extends JpaRepository<ReportingPeriod, Long> {

}