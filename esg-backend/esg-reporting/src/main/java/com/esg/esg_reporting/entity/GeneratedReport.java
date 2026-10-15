package com.esg.esg_reporting.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class GeneratedReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reportName;

    private String filePath;

    private Integer version;

    private LocalDateTime generatedAt;

    @ManyToOne
    private ReportingPeriod reportingPeriod;
    
    @PrePersist
    public void setGeneratedAt() {
        generatedAt = LocalDateTime.now();
    }
}