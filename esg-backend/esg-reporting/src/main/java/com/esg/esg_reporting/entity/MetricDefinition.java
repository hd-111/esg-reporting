package com.esg.esg_reporting.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class MetricDefinition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String metricName;

    private String pillar;

    private String description;

    private String unit;

    private String formula;

    private String dataSource;

    private String reportingBoundary;

    private String responsibleOwner;
}