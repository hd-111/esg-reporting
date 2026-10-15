package com.esg.esg_reporting.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class ReportingPeriod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String periodName;

    private LocalDate startDate;

    private LocalDate endDate;

    private String reportingBoundary;

    @ManyToOne
    private ReportingOrganization organization;
}