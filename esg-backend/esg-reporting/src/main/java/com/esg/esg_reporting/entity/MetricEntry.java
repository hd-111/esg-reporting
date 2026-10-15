package com.esg.esg_reporting.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class MetricEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double metricValue;

    private String unit;

    private String dataStatus;

    private String measurementMethod;

    private String notes;

    private String source;

    private String reviewStatus;

    private LocalDateTime createdAt;

    @ManyToOne
    private MetricDefinition metricDefinition;

    @ManyToOne
    private ReportingPeriod reportingPeriod;

    @ManyToOne
    private Facility facility;
    
    @PrePersist
    public void setCreatedAt() {
        createdAt = LocalDateTime.now();
    }
}