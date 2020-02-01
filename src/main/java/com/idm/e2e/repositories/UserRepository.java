package com.idm.e2e.repositories;

import com.idm.e2e.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    @Query("select User from UserEntity User where User.email = ?1")
    UserEntity findByEmail(String email);

    @Query("select User from UserEntity User where User.activationCode = ?1")
    UserEntity findByCode(String code);

    @Query("select User from UserEntity User where User.email = :email and User.enabled = :enabled and User.deleted = :deleted")
    UserEntity findActiveUser(@Param("email") String email,
                              @Param("enabled") boolean enabled,
                              @Param("deleted") boolean deleted);

    @Query("select User from UserEntity User where User.activationCode = :code and User.enabled = :enabled and User.deleted = :deleted")
    UserEntity findActiveUserByCode(@Param("code") String code,
                                    @Param("enabled") boolean enabled,
                                    @Param("deleted") boolean deleted);
}
