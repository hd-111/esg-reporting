package com.esg.esg_reporting.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Evidence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String fileType;

    private Long fileSize;

    private String filePath;

    private String uploadedBy;

    private LocalDateTime uploadedAt;

    @ManyToOne
    private MetricEntry metricEntry;

    @PrePersist
    public void setUploadedAt() {
        uploadedAt = LocalDateTime.now();
    }
}