package com.esg.esg_reporting.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.esg.esg_reporting.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

}